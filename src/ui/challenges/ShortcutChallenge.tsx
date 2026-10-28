/**
 * Desafio de atalho de teclado.
 *
 * Modo real: o jogador pressiona as teclas de verdade numa área de prática focável;
 * só o que acontece DENTRO da área é capturado. Modo virtual: a combinação é montada
 * no teclado virtual (atalhos reservados ao sistema/navegador, preferência do jogador
 * ou atalho exclusivo do Windows no macOS).
 *
 * A área de prática mostra um mini documento com efeitos simulados (selecionar, copiar,
 * colar, negrito, salvar...), apenas visuais. Quem decide se a resposta está certa é o
 * motor, via `submit`.
 */
import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import type { KeyCombo } from '../../content/types';
import {
  comboEquals,
  comboFromEvent,
  comboKeys,
  expectedCombos,
  formatCombo,
  isCapturableInPage,
  isModifierOnly,
  normalizeKey,
  type Platform,
} from '../../domain/sim/keys';
import { ComboKeys } from '../components/Kbd';
import { Icon } from '../components/Icon';
import { RichText, plainText } from '../components/RichText';
import { VirtualKeyboard } from './VirtualKeyboard';
import type { ChallengeProps } from './types';
import './Shortcut.css';

// ---------------------------------------------------------------------------
// Mini documento simulado (efeitos só visuais)
// ---------------------------------------------------------------------------

const BOLD = 1;
const ITALIC = 2;
const UNDERLINE = 4;
const PASTED = 8;
const TYPED = 16;

interface Doc {
  text: string;
  /** Formatação por caractere (máscara de bits). */
  styles: number[];
  caret: number;
  /** Ponta fixa da seleção; igual a `caret` quando não há seleção. */
  anchor: number;
}

type SaveState = 'none' | 'saved' | 'dirty';

interface Sim {
  doc: Doc;
  past: Doc[];
  future: Doc[];
  search: boolean;
  query: string;
  print: boolean;
  save: SaveState;
  message: string | null;
}

/** Área de transferência simulada, compartilhada entre etapas (copiar numa, colar na outra). */
let simulatedClipboard: string | null = null;

const MARKUP = /\*\*|`|\{\{/;
const IGNORED_KEYS = new Set(['dead', 'unidentified', 'process', 'compose']);

function createSim(practiceText: string | undefined): Sim {
  const source = MARKUP.test(practiceText ?? '') ? plainText(practiceText ?? '') : (practiceText ?? '');
  const text = source
    .split(/\n+/)
    .filter((line) => line.trim().length > 0)
    .join('\n');
  const blank = text.indexOf('_');
  const caret = blank >= 0 ? blank : 0;
  return {
    doc: { text, styles: Array.from({ length: text.length }, () => 0), caret, anchor: caret },
    past: [],
    future: [],
    search: false,
    query: '',
    print: false,
    save: 'none',
    message: null,
  };
}

const isWordChar = (ch: string | undefined) => ch !== undefined && /[\p{L}\p{N}]/u.test(ch);

function selectionOf(doc: Doc): [number, number] {
  return [Math.min(doc.caret, doc.anchor), Math.max(doc.caret, doc.anchor)];
}

function quote(text: string, max = 48): string {
  const flat = text.replace(/\n/g, ' ');
  return `“${flat.length > max ? `${flat.slice(0, max - 1)}…` : flat}”`;
}

function charName(ch: string): string {
  return ch === ' ' ? 'espaço' : `“${ch}”`;
}

function replaceRange(doc: Doc, start: number, end: number, insert: string, flag: number): Doc {
  const text = doc.text.slice(0, start) + insert + doc.text.slice(end);
  const styles = [...doc.styles.slice(0, start), ...Array.from({ length: insert.length }, () => flag), ...doc.styles.slice(end)];
  const caret = start + insert.length;
  return { text, styles, caret, anchor: caret };
}

function withEdit(sim: Sim, doc: Doc, message: string): Sim {
  return { ...sim, doc, past: [...sim.past, sim.doc].slice(-50), future: [], save: 'dirty', message };
}

function lineStart(text: string, i: number): number {
  return text.lastIndexOf('\n', i - 1) + 1;
}

function lineEnd(text: string, i: number): number {
  const next = text.indexOf('\n', i);
  return next === -1 ? text.length : next;
}

/** Windows: Ctrl+→ vai para o início da próxima palavra. */
function nextWordWindows(text: string, i: number): number {
  let j = i;
  if (isWordChar(text[j])) while (j < text.length && isWordChar(text[j])) j++;
  else if (j < text.length) j++;
  while (j < text.length && text[j] === ' ') j++;
  return j;
}

function previousWordWindows(text: string, i: number): number {
  let j = i;
  while (j > 0 && text[j - 1] === ' ') j--;
  if (isWordChar(text[j - 1])) while (j > 0 && isWordChar(text[j - 1])) j--;
  else if (j > 0) j--;
  return j;
}

/** macOS: Option+→ vai para o fim da palavra. */
function nextWordMac(text: string, i: number): number {
  let j = i;
  while (j < text.length && !isWordChar(text[j])) j++;
  while (j < text.length && isWordChar(text[j])) j++;
  return j;
}

function previousWordMac(text: string, i: number): number {
  let j = i;
  while (j > 0 && !isWordChar(text[j - 1])) j--;
  while (j > 0 && isWordChar(text[j - 1])) j--;
  return j;
}

type MoveUnit = 'char' | 'word' | 'line' | 'doc' | 'row';

function moveCaret(sim: Sim, combo: KeyCombo, key: string, mac: boolean): Sim {
  const { doc } = sim;
  const { text } = doc;
  const forward = key === 'arrowright' || key === 'end' || key === 'arrowdown';
  let unit: MoveUnit;
  if (key === 'home' || key === 'end') unit = (mac ? combo.meta : combo.ctrl) ? 'doc' : 'line';
  else if (key === 'arrowup' || key === 'arrowdown') unit = mac && combo.meta ? 'doc' : 'row';
  else if (mac && combo.meta) unit = 'line';
  else if (mac ? combo.alt : combo.ctrl) unit = 'word';
  else unit = 'char';

  const [start, end] = selectionOf(doc);
  const from = doc.caret;
  let target: number;
  switch (unit) {
    case 'char':
      target = !combo.shift && start !== end ? (forward ? end : start) : from + (forward ? 1 : -1);
      break;
    case 'word':
      target = forward
        ? mac
          ? nextWordMac(text, from)
          : nextWordWindows(text, from)
        : mac
          ? previousWordMac(text, from)
          : previousWordWindows(text, from);
      break;
    case 'line':
      target = forward ? lineEnd(text, from) : lineStart(text, from);
      break;
    case 'doc':
      target = forward ? text.length : 0;
      break;
    case 'row': {
      const column = from - lineStart(text, from);
      if (forward) {
        const nextStart = lineEnd(text, from) + 1;
        target = nextStart > text.length ? text.length : Math.min(nextStart + column, lineEnd(text, nextStart));
      } else {
        const currentStart = lineStart(text, from);
        if (currentStart === 0) target = 0;
        else {
          const prevStart = lineStart(text, currentStart - 1);
          target = Math.min(prevStart + column, currentStart - 1);
        }
      }
      break;
    }
  }
  target = Math.max(0, Math.min(text.length, target));
  const next: Doc = combo.shift ? { ...doc, caret: target } : { ...doc, caret: target, anchor: target };
  let message: string;
  if (combo.shift) {
    const [s, e] = selectionOf(next);
    message = s === e ? 'Nada selecionado.' : `Selecionado: ${quote(text.slice(s, e))}`;
  } else {
    const messages: Record<MoveUnit, string> = {
      char: 'Cursor andou um caractere.',
      word: forward ? 'Cursor saltou para a próxima palavra.' : 'Cursor voltou uma palavra.',
      line: forward ? 'Cursor foi para o fim da linha.' : 'Cursor foi para o início da linha.',
      doc: forward ? 'Cursor foi para o fim do documento.' : 'Cursor foi para o início do documento.',
      row: forward ? 'Cursor desceu uma linha.' : 'Cursor subiu uma linha.',
    };
    message = messages[unit];
  }
  return { ...sim, doc: next, message };
}

function undo(sim: Sim): Sim {
  const previous = sim.past[sim.past.length - 1];
  const message = 'Desfeito: a última ação foi revertida.';
  if (!previous) return { ...sim, message };
  return { ...sim, doc: previous, past: sim.past.slice(0, -1), future: [sim.doc, ...sim.future], save: 'dirty', message };
}

function redo(sim: Sim): Sim {
  const next = sim.future[0];
  const message = 'Refeito: a ação desfeita voltou.';
  if (!next) return { ...sim, message };
  return { ...sim, doc: next, past: [...sim.past, sim.doc], future: sim.future.slice(1), save: 'dirty', message };
}

const STYLE_KEYS: Record<string, { flag: number; name: string }> = {
  b: { flag: BOLD, name: 'Negrito' },
  i: { flag: ITALIC, name: 'Itálico' },
  u: { flag: UNDERLINE, name: 'Sublinhado' },
};

function toggleStyle(sim: Sim, key: string, editable: boolean): Sim {
  const style = STYLE_KEYS[key]!;
  const { doc } = sim;
  const [start, end] = selectionOf(doc);
  if (start === end) return { ...sim, message: `${style.name}: selecione um trecho para ver o efeito.` };
  if (!editable) return { ...sim, message: `${style.name} aplicado à seleção.` };
  const all = doc.styles.slice(start, end).every((s) => (s & style.flag) !== 0);
  const styles = doc.styles.map((s, i) => (i >= start && i < end ? (all ? s & ~style.flag : s | style.flag) : s));
  return withEdit(sim, { ...doc, styles }, `${style.name} ${all ? 'removido da' : 'aplicado à'} seleção.`);
}

function blankRuns(text: string): [number, number][] {
  const runs: [number, number][] = [];
  const pattern = /_+/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) runs.push([match.index, match.index + match[0].length]);
  return runs;
}

function countMatches(text: string, query: string): number {
  if (!query) return 0;
  const haystack = text.toLocaleLowerCase('pt-BR');
  const needle = query.toLocaleLowerCase('pt-BR');
  let count = 0;
  let from = haystack.indexOf(needle);
  while (from !== -1) {
    count++;
    from = haystack.indexOf(needle, from + needle.length);
  }
  return count;
}

/** Aplica o efeito visual de uma combinação. Devolve o novo estado e a área de transferência. */
function simulate(sim: Sim, combo: KeyCombo, platform: Platform, editable: boolean, clipboard: string | null): [Sim, string | null] {
  const key = normalizeKey(combo.key);
  const mac = platform === 'mac';
  const primary = mac ? Boolean(combo.meta) && !combo.ctrl : Boolean(combo.ctrl) && !combo.meta;
  const { doc } = sim;
  const [start, end] = selectionOf(doc);
  const selected = doc.text.slice(start, end);
  const say = (message: string | null): [Sim, string | null] => [{ ...sim, message }, clipboard];

  if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'home', 'end'].includes(key) && !(combo.alt && !mac)) {
    return [moveCaret(sim, combo, key, mac), clipboard];
  }

  if (primary && !combo.alt) {
    switch (key) {
      case 'a':
        return [{ ...sim, doc: { ...doc, anchor: 0, caret: doc.text.length }, message: 'Todo o texto foi selecionado.' }, clipboard];
      case 'c':
        if (!selected) return say('Copiado para a área de transferência (nada estava selecionado).');
        return [{ ...sim, message: `Copiado para a área de transferência: ${quote(selected)}` }, selected];
      case 'x':
        if (!selected) return say('Recortar: selecione um trecho antes.');
        if (!editable) return [{ ...sim, message: `Recortado: ${quote(selected)}` }, selected];
        return [withEdit(sim, replaceRange(doc, start, end, '', 0), `Recortado: ${quote(selected)} saiu do texto e foi para a área de transferência.`), selected];
      case 'v': {
        const content = clipboard ?? 'conteúdo colado';
        if (!editable) return say('Colado da área de transferência.');
        return [withEdit(sim, replaceRange(doc, start, end, content, PASTED), `Colado: ${quote(content)}`), clipboard];
      }
      case 'z':
        return [combo.shift ? redo(sim) : undo(sim), clipboard];
      case 'y':
        return [redo(sim), clipboard];
      case 's':
        return [{ ...sim, save: 'saved', message: 'Documento salvo.' }, clipboard];
      case 'f':
        return [{ ...sim, search: true, print: false, message: 'Busca aberta: digite o termo para localizar no documento.' }, clipboard];
      case 'h':
        return [{ ...sim, search: true, print: false, message: 'Localizar e substituir aberto (simulação).' }, clipboard];
      case 'p':
        return [{ ...sim, print: true, search: false, message: 'Janela de impressão (simulada): nada foi enviado à impressora.' }, clipboard];
      case 'b':
      case 'i':
      case 'u':
        return [toggleStyle(sim, key, editable), clipboard];
      case 'l':
        return say('Barra de endereço selecionada (simulação).');
      default:
        return say(null);
    }
  }

  switch (key) {
    case 'escape':
      if (sim.print) return [{ ...sim, print: false, message: 'Impressão cancelada.' }, clipboard];
      if (sim.search) return [{ ...sim, search: false, query: '', message: 'Busca fechada.' }, clipboard];
      return say('Esc: cancelado. Nada foi confirmado.');
    case 'tab': {
      if (combo.ctrl || combo.alt || combo.meta) return say(null);
      const runs = blankRuns(doc.text);
      if (runs.length === 0) return say(combo.shift ? 'Shift+Tab: o foco voltou ao item anterior.' : 'Tab: o foco foi para o próximo campo.');
      const caret = doc.caret;
      const target = combo.shift
        ? ([...runs].reverse().find(([, e]) => e < caret) ?? runs[runs.length - 1]!)
        : (runs.find(([s]) => s > caret) ?? runs[0]!);
      return [
        {
          ...sim,
          doc: { ...doc, caret: target[0], anchor: target[0] },
          message: combo.shift ? 'Shift+Tab: o cursor voltou ao campo anterior.' : 'Tab: o cursor foi para o próximo campo.',
        },
        clipboard,
      ];
    }
    case 'enter':
      if (sim.search) return say(sim.query ? 'Enter: próxima ocorrência.' : 'Digite o termo antes de buscar.');
      return say(null);
    case 'backspace':
    case 'delete': {
      if (sim.search && key === 'backspace' && !combo.ctrl) return [{ ...sim, query: sim.query.slice(0, -1), message: null }, clipboard];
      if (!editable) return say('Apagado.');
      let from = start;
      let to = end;
      if (from === to) {
        if (key === 'backspace' && from > 0) from--;
        else if (key === 'delete' && to < doc.text.length) to++;
        else return say(null);
      }
      return [withEdit(sim, replaceRange(doc, from, to, '', 0), `Apagado: ${quote(doc.text.slice(from, to))}`), clipboard];
    }
    case 'f1':
      return say('F1: ajuda aberta (simulação).');
    case 'f2':
      return say('F2: renomear o item selecionado.');
    case 'f5':
      return say('F5: página atualizada (simulação).');
    case 'f11':
      return say('F11: tela cheia (simulação).');
    case 'printscreen':
      return say('Captura de tela (simulada).');
    default:
      break;
  }

  // Caractere digitado (sem Ctrl/Cmd/Alt).
  if (key.length === 1 && !combo.ctrl && !combo.meta && !combo.alt) {
    if (combo.shift && !/\p{L}/u.test(key)) return say(null);
    const ch = combo.shift ? key.toLocaleUpperCase('pt-BR') : key;
    if (sim.search) return [{ ...sim, query: sim.query + ch, message: null }, clipboard];
    if (!editable) return say(`Digitado: ${charName(ch)}`);
    const overwrite = start === end && doc.text[start] === '_';
    return [withEdit(sim, replaceRange(doc, start, overwrite ? start + 1 : end, ch, TYPED), `Digitado: ${charName(ch)}`), clipboard];
  }
  return say(null);
}

/** Converte um ponto da seleção do DOM em posição no texto do documento. */
function pointToOffset(root: HTMLElement, node: Node | null, offset: number): number | null {
  if (!node || !root.contains(node)) return null;
  if (node.nodeType === Node.TEXT_NODE) {
    const span = node.parentElement?.closest<HTMLElement>('[data-o]');
    if (!span || !root.contains(span)) return null;
    return Number(span.dataset.o) + Math.min(offset, Number(span.dataset.len ?? 0));
  }
  if (node instanceof HTMLElement) {
    const child = node.childNodes[offset];
    if (child instanceof HTMLElement) {
      const span = child.matches('[data-o]') ? child : child.querySelector<HTMLElement>('[data-o]');
      if (span) return Number(span.dataset.o);
    }
    const spans = node.querySelectorAll<HTMLElement>('[data-o]');
    const last = spans[spans.length - 1];
    if (last) return Number(last.dataset.o) + Number(last.dataset.len ?? 0);
  }
  return null;
}

function styleClass(style: number, selected: boolean): string {
  const classes: string[] = [];
  if (style & BOLD) classes.push('sc-b');
  if (style & ITALIC) classes.push('sc-i');
  if (style & UNDERLINE) classes.push('sc-u');
  if (style & PASTED) classes.push('sc-pasted');
  if (style & TYPED) classes.push('sc-typed');
  if (selected) classes.push('sc-sel');
  return classes.join(' ');
}

function DocView({ doc, showCaret }: { doc: Doc; showCaret: boolean }) {
  const { text, styles, caret } = doc;
  const [selStart, selEnd] = selectionOf(doc);
  const caretNode = <span key="caret" className="sc-caret" data-o={caret} data-len={0} aria-hidden="true" />;
  const paragraphs: ReactNode[] = [];
  let lineFrom = 0;
  text.split('\n').forEach((line, index) => {
    const from = lineFrom;
    const to = from + line.length;
    const nodes: ReactNode[] = [];
    if (line.length === 0) {
      if (showCaret && caret === from) nodes.push(caretNode);
      nodes.push(
        <span key="empty" data-o={from} data-len={0}>
          {'​'}
        </span>,
      );
    }
    let i = from;
    while (i < to) {
      if (showCaret && i === caret) nodes.push(caretNode);
      const style = styles[i] ?? 0;
      const selected = i >= selStart && i < selEnd;
      let j = i + 1;
      while (j < to && j !== caret && j !== selStart && j !== selEnd && (styles[j] ?? 0) === style) j++;
      nodes.push(
        <span key={i} data-o={i} data-len={j - i} className={styleClass(style, selected) || undefined}>
          {text.slice(i, j)}
        </span>,
      );
      i = j;
    }
    if (showCaret && line.length > 0 && caret === to) nodes.push(caretNode);
    paragraphs.push(<p key={index}>{nodes}</p>);
    lineFrom = to + 1;
  });
  return <>{paragraphs}</>;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

type Verdict = 'ok' | 'wrong' | 'done' | null;

/**
 * Escolha do jogador pelo teclado virtual, lembrada entre etapas da sessão enquanto a
 * preferência das Configurações não mudar (evita reativar a chave a cada etapa).
 */
let rememberedVirtualChoice: { choice: boolean; preference: boolean } | null = null;

interface Flash {
  kind: 'none' | 'hit' | 'wrong';
  /** Alterna entre duas animações idênticas para reiniciá-las sem remontar a área. */
  tick: number;
}

export function ShortcutChallenge({ step, locked, revealed, submit, platform, preferVirtualKeyboard }: ChallengeProps<'shortcut'>) {
  const windowsOnMac = Boolean(step.windowsOnly) && platform === 'mac';
  const practicePlatform: Platform = windowsOnMac ? 'windows' : platform;
  const expected = useMemo(() => expectedCombos(step, practicePlatform), [step, practicePlatform]);
  const forcedVirtual = step.capture === 'virtual' || windowsOnMac;
  const [virtualChoice, setVirtualChoiceState] = useState(() =>
    rememberedVirtualChoice && rememberedVirtualChoice.preference === preferVirtualKeyboard
      ? rememberedVirtualChoice.choice
      : preferVirtualKeyboard,
  );
  const setVirtualChoice = (choice: boolean) => {
    rememberedVirtualChoice = { choice, preference: preferVirtualKeyboard };
    setVirtualChoiceState(choice);
  };
  const virtual = forcedVirtual || virtualChoice;
  const hasDoc = step.capture === 'real';
  const hasText = Boolean(step.practiceText?.trim());
  const editable = !MARKUP.test(step.practiceText ?? '');
  const tabInAnswer = expected.some((c) => normalizeKey(c.key) === 'tab');

  const [pressed, setPressedState] = useState<KeyCombo[]>([]);
  const pressedRef = useRef<KeyCombo[]>([]);
  const doneRef = useRef(false);
  const [received, setReceived] = useState<KeyCombo | null>(null);
  const [held, setHeld] = useState<KeyCombo | null>(null);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [flash, setFlash] = useState<Flash>({ kind: 'none', tick: 0 });
  const [focused, setFocused] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [sim, setSimState] = useState<Sim>(() => createSim(step.practiceText));
  const simRef = useRef(sim);
  const docRef = useRef<HTMLDivElement>(null);
  const wasFocusedRef = useRef(false);
  const instructionId = useId();

  const setSim = (next: Sim) => {
    simRef.current = next;
    setSimState(next);
  };
  const setPressed = (next: KeyCombo[]) => {
    pressedRef.current = next;
    setPressedState(next);
  };

  const total = expected.length;
  const completed = locked || verdict === 'done';
  const done = completed ? total : pressed.length;
  const interactive = hasDoc && !virtual && !locked;

  const handleCombo = (combo: KeyCombo) => {
    if (locked || doneRef.current) return;
    if (hasDoc) {
      const [nextSim, clipboard] = simulate(simRef.current, combo, practicePlatform, editable, simulatedClipboard);
      simulatedClipboard = clipboard;
      setSim(nextSim);
    }
    setReceived(combo);
    const label = formatCombo(combo, practicePlatform);
    const sofar = pressedRef.current;
    const target = expected[sofar.length];
    const attempt = [...sofar, combo];

    if (target && comboEquals(combo, target) && attempt.length < total) {
      setPressed(attempt);
      setVerdict('ok');
      setFlash((f) => ({ kind: 'hit', tick: f.tick + 1 }));
      setAnnouncement(`${label}: certo. Passo ${attempt.length} de ${total} concluído.`);
      return;
    }

    const evaluation = submit({ kind: 'shortcut', pressed: attempt, platform: practicePlatform });
    if (evaluation.correct) {
      doneRef.current = true;
      setPressed(attempt);
      setVerdict('done');
      setFlash((f) => ({ kind: 'hit', tick: f.tick + 1 }));
      setAnnouncement(`${label}: atalho registrado.`);
      return;
    }
    setPressed([]);
    setVerdict('wrong');
    setFlash((f) => ({ kind: 'wrong', tick: f.tick + 1 }));
    setAnnouncement(`${label}: não é a combinação pedida.${total > 1 ? ' A sequência recomeçou.' : ''}`);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!interactive || event.nativeEvent.isComposing) return;
    const combo = comboFromEvent(event);
    const key = normalizeKey(combo.key);
    if (isModifierOnly(combo)) {
      setHeld(comboKeys(combo, practicePlatform).length > 0 ? combo : null);
      return;
    }
    if (IGNORED_KEYS.has(key)) return;
    // Tab sem modificadores continua navegando pela página quando não faz parte do atalho.
    if (key === 'tab' && !combo.ctrl && !combo.alt && !combo.meta && !tabInAnswer) return;
    if (isCapturableInPage(combo)) event.preventDefault();
    setHeld(null);
    if (event.repeat) return;
    handleCombo(combo);
  };

  const onKeyUp = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const released = comboFromEvent(event);
    // Só modificadores mudam o "segurando"; soltar a tecla final mantém a combinação à vista.
    if (!isModifierOnly(released)) return;
    const releasedKey = normalizeKey(released.key);
    const flags: KeyCombo = { key: 'shift' };
    if (event.ctrlKey && releasedKey !== 'ctrl') flags.ctrl = true;
    if (event.shiftKey && releasedKey !== 'shift') flags.shift = true;
    if (event.altKey && releasedKey !== 'alt') flags.alt = true;
    if (event.metaKey && releasedKey !== 'meta') flags.meta = true;
    setHeld(comboKeys(flags, practicePlatform).length > 0 ? flags : null);
  };

  const onMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    wasFocusedRef.current = document.activeElement === event.currentTarget;
  };

  const syncSelection = () => {
    const root = docRef.current;
    if (!interactive || !editable || !root || typeof window.getSelection !== 'function') return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const anchor = pointToOffset(root, selection.anchorNode, selection.anchorOffset);
    const focus = pointToOffset(root, selection.focusNode, selection.focusOffset);
    if (anchor === null || focus === null) return;
    selection.removeAllRanges();
    // O clique que só ativa a área não mexe no cursor simulado; arrastar para selecionar, sim.
    if (anchor === focus && !wasFocusedRef.current) return;
    const current = simRef.current;
    const length = current.doc.text.length;
    const doc = { ...current.doc, anchor: Math.min(anchor, length), caret: Math.min(focus, length) };
    const [s, e] = selectionOf(doc);
    setSim({ ...current, doc, message: s === e ? 'Cursor posicionado.' : `Selecionado: ${quote(doc.text.slice(s, e))}` });
  };

  const display = held ?? received;
  const displayKeys = display ? comboKeys(display, practicePlatform) : [];
  const currentExpected = expected[Math.min(pressed.length, total - 1)] ?? null;
  const allSelected = sim.doc.text.length > 0 && selectionOf(sim.doc)[0] === 0 && selectionOf(sim.doc)[1] === sim.doc.text.length;
  const flashClass = flash.kind === 'none' ? '' : `is-${flash.kind}-${flash.tick % 2}`;

  const verdictNode = (() => {
    if (held) return <span className="faint">segurando…</span>;
    if (completed)
      return (
        <span className="sc-verdict ok">
          <Icon name="check" size={16} /> Atalho registrado
        </span>
      );
    if (verdict === 'ok')
      return (
        <span className="sc-verdict ok">
          <Icon name="check" size={16} /> Certo! Agora o próximo passo
        </span>
      );
    if (verdict === 'wrong')
      return (
        <span className="sc-verdict wrong">
          <Icon name="x" size={16} /> Não é a combinação pedida{total > 1 ? '; a sequência recomeçou' : ''}. Tente de novo.
        </span>
      );
    return null;
  })();

  return (
    <div className="challenge shortcut">
      {windowsOnMac && (
        <div className="callout warn">
          <Icon name="alert" />
          <div>
            <p className="callout-title">Atalho do Windows</p>
            <p>
              Este atalho é do Windows e não tem equivalente direto no macOS. A prática usa o teclado virtual com a tecla Windows (
              <kbd>Win</kbd>). A alternativa para o Mac aparece ao concluir a etapa.
            </p>
          </div>
        </div>
      )}

      <div className="sc-toolbar">
        <div className="sc-progress">
          <span className="eyebrow">{total > 1 ? `Passo ${Math.min(done + 1, total)} de ${total}` : 'Uma combinação'}</span>
          {total > 1 && (
            <ol className="sc-steps" aria-hidden="true">
              {expected.map((_, index) => {
                const isDone = index < done;
                const isCurrent = !isDone && index === done;
                return (
                  <li key={index} className={isDone ? 'is-done' : isCurrent ? 'is-current' : ''}>
                    {isDone ? <Icon name="check" size={14} strokeWidth={2.5} /> : index + 1}
                  </li>
                );
              })}
            </ol>
          )}
          <span className="visually-hidden">
            {done} de {total} {total === 1 ? 'combinação concluída' : 'combinações concluídas'}.
          </span>
        </div>
        {!forcedVirtual && (
          <label className="switch">
            <input type="checkbox" checked={virtual} disabled={locked} onChange={(e) => setVirtualChoice(e.target.checked)} />
            <span className="track" aria-hidden="true" />
            <span>Usar teclado virtual</span>
          </label>
        )}
      </div>

      {virtual && !locked && (
        <div className="callout info">
          <Icon name="keyboard" />
          <p>
            {step.capture === 'virtual' || windowsOnMac
              ? 'Este atalho é reservado ao sistema ou ao navegador; aqui você monta a combinação no teclado virtual. No seu computador, pressione as teclas de verdade.'
              : 'Monte a combinação no teclado virtual: toque nos modificadores e depois na tecla final. No seu computador, pressione as teclas de verdade.'}
          </p>
        </div>
      )}

      {hasDoc && (
        <div
          className={`sc-area sim-window ${focused && interactive ? 'is-focused' : ''} ${interactive ? '' : 'is-static'} ${flashClass}`}
          role={interactive ? 'application' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? 'Área de prática de atalhos: pressione as teclas aqui' : undefined}
          aria-describedby={interactive ? instructionId : undefined}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setHeld(null);
          }}
          onMouseDown={onMouseDown}
          onMouseUp={syncSelection}
        >
          <div className="sim-titlebar">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{hasText ? 'documento.txt' : 'área de prática'}</span>
            <span className="sc-save">
              {sim.save === 'saved' ? (
                <>
                  <Icon name="check" size={14} /> Salvo
                </>
              ) : sim.save === 'dirty' ? (
                'Não salvo'
              ) : (
                ''
              )}
            </span>
          </div>
          {interactive && (
            <p id={instructionId} className={`sc-hint ${focused ? 'is-ready' : ''}`}>
              <Icon name={focused ? 'keyboard' : 'crosshair'} size={16} />
              {focused ? 'Pronto: pressione o atalho. As teclas só são capturadas dentro desta área.' : 'Clique aqui e pressione o atalho.'}
            </p>
          )}
          {sim.search && (
            <div className="sc-search" aria-hidden="true">
              <Icon name="search" size={16} />
              <span className="sc-search-field">
                {sim.query || <span className="faint">Localizar no documento…</span>}
                <span className="sc-caret" />
              </span>
              <span className="faint">
                {sim.query ? `${countMatches(sim.doc.text, sim.query)} resultado(s)` : ''} · Esc fecha
              </span>
            </div>
          )}
          <div className={`sc-doc ${!editable && allSelected ? 'sc-all' : ''}`} ref={docRef}>
            {!hasText ? (
              <p className="faint">Nada para editar aqui: clique nesta área e pressione o atalho pedido.</p>
            ) : editable ? (
              <DocView doc={sim.doc} showCaret={!locked} />
            ) : (
              <RichText text={step.practiceText ?? ''} />
            )}
          </div>
          {sim.print && (
            <div className="sc-print" aria-hidden="true">
              <strong>
                <Icon name="file" size={16} /> Imprimir (simulação)
              </strong>
              <span>Impressora: Nexo PDF · Páginas: todas</span>
              <span className="faint">Nada é enviado de verdade. Esc fecha.</span>
            </div>
          )}
          <p className="sim-status">{sim.message ?? (completed ? 'Tudo certo.' : 'Aguardando o atalho…')}</p>
        </div>
      )}

      <div className={`sc-received ${flashClass}`}>
        <span className="eyebrow">O computador recebeu</span>
        <span className="sc-keys">
          {displayKeys.length > 0 && display ? (
            <ComboKeys combo={display} platform={practicePlatform} />
          ) : (
            <span className="faint">nenhuma tecla ainda</span>
          )}
        </span>
        {verdictNode}
      </div>

      {virtual && (
        <VirtualKeyboard
          platform={practicePlatform}
          onCombo={handleCombo}
          disabled={locked}
          highlight={revealed && !completed ? currentExpected : null}
          label="Teclado virtual para montar o atalho"
        />
      )}

      {(revealed || completed) && (
        <div className={`sc-solution ${completed ? 'is-done' : ''}`}>
          <span className="eyebrow accent">{completed ? 'Combinação do atalho' : 'Combinação esperada'}</span>
          <ol className="sc-solution-list">
            {expected.map((combo, index) => (
              <li key={index}>
                {total > 1 && <span className="faint mono">{index + 1}.</span>}
                <ComboKeys combo={combo} platform={practicePlatform} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {(locked || revealed) && step.platformNote && (
        <div className="callout info">
          <Icon name="info" />
          <div>
            <p className="callout-title">Observação de plataforma</p>
            <RichText text={step.platformNote} />
          </div>
        </div>
      )}

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
      <p className="visually-hidden" aria-live="polite">
        {sim.message ?? ''}
      </p>
    </div>
  );
}
