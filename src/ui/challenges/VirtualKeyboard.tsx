/**
 * Teclado virtual compacto (ABNT2) para montar combinações de teclas.
 *
 * Modificadores (Ctrl, Shift, Alt, Win/Cmd) ficam "travados" ao clicar e são soltos
 * depois da próxima tecla comum; essa tecla emite um `KeyCombo` por `onCombo` com os
 * modificadores ativos. Navegação por teclado: Tab entra no teclado e as setas movem
 * entre as teclas (um único ponto de parada no Tab).
 *
 * Usado nos desafios de atalho e no Treino.
 */
import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { KeyCombo } from '../../content/types';
import { comboKeys, formatCombo, normalizeKey, type Platform } from '../../domain/sim/keys';
import { ComboKeys } from '../components/Kbd';
import { Icon } from '../components/Icon';
import './VirtualKeyboard.css';

type Modifier = 'ctrl' | 'shift' | 'alt' | 'meta';

interface KeySpec {
  /** Valor emitido em `KeyCombo.key` (teclas comuns). */
  key?: string;
  /** Tecla modificadora (trava ao clicar). */
  mod?: Modifier;
  /** Caps Lock: alterna o estado, não emite combinação. */
  caps?: boolean;
  label: string;
  /** Legenda secundária (símbolo com Shift). */
  sub?: string;
  /** Nome lido pelo leitor de tela. */
  aria: string;
  /** Largura em quartos de tecla: 4 = uma tecla comum. Padrão 4. */
  w?: number;
  /** Ocupa duas fileiras (Enter). */
  tall?: boolean;
  /** Rótulo em palavra (fonte menor). */
  word?: boolean;
}

interface PlacedKey extends KeySpec {
  id: string;
  row: number;
  col: number;
  width: number;
  rows: number;
}

const COLUMNS = 60;

const letter = (ch: string, aria?: string): KeySpec => ({ key: ch, label: ch.toUpperCase(), aria: aria ?? ch.toUpperCase() });
const symbol = (key: string, sub: string, aria: string): KeySpec => ({ key, label: key, sub, aria });

function layoutRows(platform: Platform): KeySpec[][] {
  const mac = platform === 'mac';
  const fn: KeySpec[] = [
    { key: 'escape', label: 'Esc', aria: 'Escape', word: true },
    ...Array.from({ length: 12 }, (_, i): KeySpec => ({ key: `f${i + 1}`, label: `F${i + 1}`, aria: `F${i + 1}`, word: true })),
    { key: 'printscreen', label: 'PrtSc', aria: 'Print Screen', word: true },
    { key: 'delete', label: 'Del', aria: 'Delete', word: true },
  ];
  const digitsShift = ['!', '@', '#', '$', '%', '¨', '&', '*', '(', ')'];
  const numbers: KeySpec[] = [
    symbol("'", '"', 'Apóstrofo'),
    ...['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d, i): KeySpec => ({ key: d, label: d, sub: digitsShift[i], aria: d })),
    symbol('-', '_', 'Hífen'),
    symbol('=', '+', 'Igual'),
    { key: 'backspace', label: mac ? '⌫ Apagar' : 'Backspace', aria: 'Backspace', w: 8, word: true },
  ];
  const top: KeySpec[] = [
    { key: 'tab', label: 'Tab ⇥', aria: 'Tab', w: 6, word: true },
    ...'qwertyuiop'.split('').map((c) => letter(c)),
    symbol('´', '`', 'Acento agudo'),
    symbol('[', '{', 'Abre colchete'),
    { key: 'enter', label: 'Enter ↵', aria: 'Enter', w: 6, tall: true, word: true },
  ];
  const home: KeySpec[] = [
    { caps: true, label: 'Caps Lock', aria: 'Caps Lock', w: 6, word: true },
    ...'asdfghjkl'.split('').map((c) => letter(c)),
    letter('ç', 'Cê-cedilha'),
    symbol('~', '^', 'Til'),
    symbol(']', '}', 'Fecha colchete'),
  ];
  const shift: KeySpec[] = [
    { mod: 'shift', label: 'Shift ⇧', aria: 'Shift', w: 8, word: true },
    ...'zxcvbnm'.split('').map((c) => letter(c)),
    symbol(',', '<', 'Vírgula'),
    symbol('.', '>', 'Ponto'),
    symbol(';', ':', 'Ponto e vírgula'),
    symbol('/', '?', 'Barra'),
    { key: 'arrowup', label: '↑', aria: 'Seta para cima' },
    { mod: 'shift', label: '⇧', aria: 'Shift (direito)', w: 4 },
  ];
  const modifiers: KeySpec[] = mac
    ? [
        { mod: 'ctrl', label: 'Control ⌃', aria: 'Control', w: 5, word: true },
        { mod: 'alt', label: 'Option ⌥', aria: 'Option', w: 5, word: true },
        { mod: 'meta', label: 'Cmd ⌘', aria: 'Command', w: 6, word: true },
        { key: ' ', label: 'Espaço', aria: 'Barra de espaço', w: 22, word: true },
      ]
    : [
        { mod: 'ctrl', label: 'Ctrl', aria: 'Control', w: 5, word: true },
        { mod: 'meta', label: 'Win ⊞', aria: 'Tecla Windows', w: 5, word: true },
        { mod: 'alt', label: 'Alt', aria: 'Alt', w: 5, word: true },
        { key: ' ', label: 'Espaço', aria: 'Barra de espaço', w: 23, word: true },
      ];
  const bottom: KeySpec[] = [
    ...modifiers,
    { key: 'home', label: 'Home', aria: 'Home (início da linha)', w: 5, word: true },
    { key: 'end', label: 'End', aria: 'End (fim da linha)', w: 5, word: true },
    { key: 'arrowleft', label: '←', aria: 'Seta para a esquerda' },
    { key: 'arrowdown', label: '↓', aria: 'Seta para baixo' },
    { key: 'arrowright', label: '→', aria: 'Seta para a direita' },
  ];
  return [fn, numbers, top, home, shift, bottom];
}

function placeKeys(platform: Platform): PlacedKey[] {
  const placed: PlacedKey[] = [];
  layoutRows(platform).forEach((row, rowIndex) => {
    let col = 1;
    row.forEach((spec, keyIndex) => {
      const width = spec.w ?? 4;
      placed.push({
        ...spec,
        id: `r${rowIndex}-k${keyIndex}`,
        row: rowIndex + 1,
        col,
        width,
        rows: spec.tall ? 2 : 1,
      });
      col += width;
    });
    if (col - 1 > COLUMNS) throw new Error(`Fileira ${rowIndex + 1} do teclado virtual excede ${COLUMNS} colunas.`);
  });
  return placed;
}

const NO_MODS: Record<Modifier, boolean> = { ctrl: false, shift: false, alt: false, meta: false };

function comboWithMods(key: string, mods: Record<Modifier, boolean>): KeyCombo {
  const combo: KeyCombo = { key };
  if (mods.ctrl) combo.ctrl = true;
  if (mods.shift) combo.shift = true;
  if (mods.alt) combo.alt = true;
  if (mods.meta) combo.meta = true;
  return combo;
}

export interface VirtualKeyboardProps {
  platform: Platform;
  onCombo: (combo: KeyCombo) => void;
  disabled?: boolean;
  /** Destaca as teclas desta combinação (ex.: solução revelada). */
  highlight?: KeyCombo | null;
  /** Nome do teclado para leitores de tela. */
  label?: string;
  className?: string;
}

export function VirtualKeyboard({ platform, onCombo, disabled = false, highlight, label = 'Teclado virtual', className }: VirtualKeyboardProps) {
  const keys = useMemo(() => placeKeys(platform), [platform]);
  const [mods, setMods] = useState<Record<Modifier, boolean>>(NO_MODS);
  const [caps, setCaps] = useState(false);
  const [focusId, setFocusId] = useState<string>(() => keys[0]!.id);
  const [announcement, setAnnouncement] = useState('');
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const helpId = useId();

  const activeMods = (Object.keys(mods) as Modifier[]).filter((m) => mods[m]);
  const modsCombo = comboWithMods('shift', mods);
  const modsLabel = activeMods.length > 0 ? comboKeys(modsCombo, platform).join(' + ') : '';

  const press = (spec: PlacedKey) => {
    if (disabled) return;
    if (spec.mod) {
      const mod = spec.mod;
      const next = { ...mods, [mod]: !mods[mod] };
      setMods(next);
      setAnnouncement(`${spec.aria.replace(' (direito)', '')} ${next[mod] ? 'travado' : 'solto'}.`);
      return;
    }
    if (spec.caps) {
      setCaps((c) => !c);
      setAnnouncement(`Caps Lock ${caps ? 'desligado' : 'ligado'}.`);
      return;
    }
    if (spec.key === undefined) return;
    const combo = comboWithMods(spec.key, mods);
    setMods(NO_MODS);
    setAnnouncement(`Enviado: ${formatCombo(combo, platform)}.`);
    onCombo(combo);
  };

  const clearMods = () => {
    setMods(NO_MODS);
    setAnnouncement('Modificadores soltos.');
  };

  const isHinted = (spec: PlacedKey): boolean => {
    if (!highlight) return false;
    if (spec.mod) return Boolean(highlight[spec.mod]);
    return spec.key !== undefined && normalizeKey(spec.key) === normalizeKey(highlight.key);
  };

  const focusKey = useCallback((id: string) => {
    setFocusId(id);
    buttons.current.get(id)?.focus();
  }, []);

  const onKeyNav = (event: ReactKeyboardEvent<HTMLButtonElement>, current: PlacedKey) => {
    const inRow = (row: number) => keys.filter((k) => k.row <= row && row < k.row + k.rows).sort((a, b) => a.col - b.col);
    const center = current.col + current.width / 2;
    const nearest = (row: number) => {
      const candidates = inRow(row);
      let best: PlacedKey | undefined;
      for (const k of candidates) {
        if (!best || Math.abs(k.col + k.width / 2 - center) < Math.abs(best.col + best.width / 2 - center)) best = k;
      }
      return best;
    };
    let target: PlacedKey | undefined;
    const row = inRow(current.row);
    const index = row.findIndex((k) => k.id === current.id);
    switch (event.key) {
      case 'ArrowRight':
        target = row[index + 1];
        break;
      case 'ArrowLeft':
        target = index > 0 ? row[index - 1] : undefined;
        break;
      case 'ArrowDown':
        target = nearest(current.row + current.rows);
        break;
      case 'ArrowUp':
        target = nearest(current.row - 1);
        break;
      case 'Home':
        target = row[0];
        break;
      case 'End':
        target = row[row.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    if (target) focusKey(target.id);
  };

  return (
    <div className={`vk ${disabled ? 'is-disabled' : ''} ${className ?? ''}`}>
      <div className="vk-status">
        <span className="vk-mods" aria-hidden="true">
          {activeMods.length > 0 ? (
            <>
              <span className="faint">Travados:</span> <ComboKeys combo={modsCombo} platform={platform} />
              <span className="faint">+ toque na tecla final</span>
            </>
          ) : (
            <span className="faint">Toque nos modificadores (eles ficam travados) e depois na tecla final.</span>
          )}
        </span>
        <button type="button" className="btn small ghost" onClick={clearMods} disabled={disabled || activeMods.length === 0}>
          <Icon name="x" size={16} /> Limpar modificadores
        </button>
      </div>
      <p id={helpId} className="visually-hidden">
        Use as setas para navegar entre as teclas e Enter ou Espaço para pressionar. Modificadores ficam travados até a próxima tecla.
        {modsLabel ? ` Travados agora: ${modsLabel}.` : ''}
      </p>
      <div className="vk-scroll">
        <div className="vk-board" role="group" aria-label={label} aria-describedby={helpId}>
          {keys.map((spec) => {
            const pressed = spec.mod ? mods[spec.mod] : spec.caps ? caps : undefined;
            const hinted = isHinted(spec);
            const classes = [
              'vk-key',
              spec.word ? 'is-word' : '',
              spec.row === 1 ? 'is-fn' : '',
              spec.mod || spec.caps ? 'is-mod' : '',
              hinted ? 'is-hint' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={spec.id}
                ref={(el) => {
                  if (el) buttons.current.set(spec.id, el);
                  else buttons.current.delete(spec.id);
                }}
                type="button"
                className={classes}
                style={{ gridColumn: `${spec.col} / span ${spec.width}`, gridRow: `${spec.row} / span ${spec.rows}` }}
                aria-label={hinted ? `${spec.aria} (faz parte da solução)` : spec.aria}
                aria-pressed={pressed}
                tabIndex={spec.id === focusId ? 0 : -1}
                disabled={disabled}
                onFocus={() => setFocusId(spec.id)}
                onKeyDown={(event) => onKeyNav(event, spec)}
                onClick={() => press(spec)}
              >
                {spec.sub && (
                  <span className="vk-sub" aria-hidden="true">
                    {spec.sub}
                  </span>
                )}
                <span className="vk-label" aria-hidden="true">
                  {spec.label}
                </span>
                {hinted && <span className="vk-hint-mark" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
      <p className="vk-swipe faint">Deslize para o lado para ver todas as teclas.</p>
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
