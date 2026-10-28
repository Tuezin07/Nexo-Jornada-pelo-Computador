/**
 * Terminal simulado ("NexoShell"). Os comandos são interpretados por
 * domain/sim/shell.ts sobre o sistema de arquivos virtual; nada sai do jogo.
 */
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { terminalGoalStatus } from '../../domain/evaluators';
import { childrenOf, createFs, normalizeName } from '../../domain/sim/fs';
import { canonicalCommand, createShell, promptPath, runCommand, tokenize, type OutputTone, type ShellState } from '../../domain/sim/shell';
import { Icon } from '../components/Icon';
import { SimGoalsPanel } from './FilesystemChallenge';
import type { ChallengeProps } from './types';
import './Terminal.css';

const WELCOME = 'NexoShell — ambiente simulado e seguro. Digite help para ver os comandos.';
/** Limite de linhas guardadas na tela, para a rolagem continuar leve. */
const MAX_LINES = 400;

interface ScreenLine {
  id: number;
  text: string;
  tone: OutputTone;
}

interface Completion {
  line: string;
  options: string[];
}

function commonPrefix(names: string[]): string {
  const [first, ...rest] = names;
  if (first === undefined) return '';
  let length = first.length;
  for (const name of rest) {
    let i = 0;
    while (i < length && i < name.length && normalizeName(first[i] ?? '') === normalizeName(name[i] ?? '')) i++;
    length = i;
  }
  return first.slice(0, length);
}

/**
 * Completa o último trecho da linha com nomes da pasta atual (como a tecla Tab
 * dos terminais reais). Devolve null quando não há o que completar.
 */
export function completeLine(shell: ShellState, line: string): Completion | null {
  const openQuote = (line.match(/"/g) ?? []).length % 2 === 1;
  const start = openQuote ? line.lastIndexOf('"') + 1 : line.lastIndexOf(' ') + 1;
  const before = line.slice(0, start);
  const partial = line.slice(start);
  if (before.trim() === '' || /[\\/*?]/.test(partial)) return null;
  const command = canonicalCommand(tokenize(line)[0] ?? '');
  const foldersOnly = command === 'cd' || command === 'rmdir';
  const wanted = normalizeName(partial);
  const matches = childrenOf(shell.fs, shell.cwd).filter(
    (item) => (!foldersOnly || item.type === 'folder') && normalizeName(item.name).startsWith(wanted),
  );
  const first = matches[0];
  if (!first) return null;
  const quoteIfNeeded = (name: string, closed: boolean) => {
    if (openQuote) return `${before}${name}${closed ? '"' : ''}`;
    return /\s/.test(name) ? `${before}"${name}${closed ? '"' : ''}` : `${before}${name}`;
  };
  if (matches.length === 1) return { line: quoteIfNeeded(first.name, true), options: [] };
  const prefix = commonPrefix(matches.map((m) => m.name));
  if (prefix.length > partial.length) return { line: quoteIfNeeded(prefix, false), options: [] };
  return { line, options: matches.map((m) => (m.type === 'folder' ? `${m.name}/` : m.name)) };
}

export function TerminalChallenge({ step, locked, submit }: ChallengeProps<'terminal'>) {
  const uid = useId();
  const [shell, setShell] = useState<ShellState>(() => createShell(createFs(step.root), step.startPath, step.network));
  const [lines, setLines] = useState<ScreenLine[]>(() => [{ id: 0, text: WELCOME, tone: 'muted' }]);
  const nextLineId = useRef(1);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const draftRef = useRef('');
  const [shake, setShake] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const prompt = promptPath(shell);
  const goalStatus = terminalGoalStatus(step, shell);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [lines]);

  const append = (newLines: { text: string; tone: OutputTone }[]) => {
    const withIds = newLines.map((l) => {
      nextLineId.current += 1;
      return { ...l, id: nextLineId.current };
    });
    setLines((current) => [...current, ...withIds].slice(-MAX_LINES));
  };

  const execute = () => {
    if (locked) return;
    const command = input;
    const result = runCommand(shell, command);
    setShell(result.state);
    if (result.clear) setLines([]);
    else append(result.output);
    const trimmed = command.trim();
    if (trimmed) setHistory((h) => (h[h.length - 1] === trimmed ? h : [...h, trimmed]));
    setHistoryIndex(null);
    draftRef.current = '';
    setInput('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    execute();
  };

  const recall = (index: number | null) => {
    setHistoryIndex(index);
    setInput(index === null ? draftRef.current : (history[index] ?? ''));
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    // O que se digita no terminal nunca dispara atalhos globais do jogo.
    event.stopPropagation();
    if (locked) return;
    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault();
        if (history.length === 0) return;
        if (historyIndex === null) draftRef.current = input;
        recall(historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1));
        return;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (historyIndex === null) return;
        recall(historyIndex + 1 >= history.length ? null : historyIndex + 1);
        return;
      }
      case 'Escape':
        if (input) {
          event.preventDefault();
          setInput('');
          setHistoryIndex(null);
        }
        return;
      case 'Tab': {
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
        const completion = completeLine(shell, input);
        // Sem nada para completar, o Tab segue movendo o foco normalmente.
        if (!completion || (completion.options.length === 0 && completion.line === input)) return;
        event.preventDefault();
        if (completion.options.length > 0) {
          append([
            { text: `${prompt}> ${input}`, tone: 'command' },
            { text: completion.options.join('    '), tone: 'muted' },
          ]);
        } else setInput(completion.line);
        return;
      }
      default:
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
          event.preventDefault();
          setLines([]);
        }
    }
  };

  const focusInput = () => {
    const selection = window.getSelection();
    // Permite selecionar e copiar a saída sem roubar o foco.
    if (selection && selection.toString().length > 0) return;
    inputRef.current?.focus();
  };

  const fill = (suggestion: string) => {
    if (locked) return;
    setInput(suggestion);
    setHistoryIndex(null);
    inputRef.current?.focus();
  };

  const verify = () => {
    if (locked) return;
    const evaluation = submit({ kind: 'terminal', state: shell });
    if (!evaluation.correct) setShake((n) => n + 1);
  };

  const suggestions = step.suggestions ?? [];

  return (
    <div className="challenge">
      <div className="sim-layout">
        <div className="sim-window term">
          <div className="sim-titlebar">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              <Icon name="terminal" size={14} className="term-title-icon" /> NexoShell
            </span>
            <span className="term-title-path" title={prompt}>
              {prompt}
            </span>
          </div>

          <div className="term-screen" onClick={focusInput}>
            <div ref={outputRef} className="term-output" role="log" aria-live="polite" aria-label="Saída do terminal" tabIndex={0}>
              {lines.map((line) => (
                <div key={line.id} className={`term-line tone-${line.tone}`}>
                  {line.tone === 'error' && <span className="visually-hidden">Erro: </span>}
                  {line.text || ' '}
                </div>
              ))}
            </div>
            <form className="term-input-row" onSubmit={onSubmit}>
              <span className="term-prompt" aria-hidden="true">
                {prompt}&gt;
              </span>
              <input
                ref={inputRef}
                className="term-input"
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setHistoryIndex(null);
                }}
                onKeyDown={onKeyDown}
                aria-label="Comando"
                aria-describedby={`${uid}-cwd ${uid}-keys`}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="send"
                disabled={locked}
              />
              <span id={`${uid}-cwd`} className="visually-hidden">
                Pasta atual: {prompt}
              </span>
              <button type="submit" className="btn small term-run" disabled={locked}>
                <Icon name="chevron-right" size={16} /> Executar
              </button>
            </form>
          </div>

          {suggestions.length > 0 && (
            <div className="term-suggestions">
              <span className="eyebrow" id={`${uid}-sug`}>
                Sugestões
              </span>
              <ul aria-labelledby={`${uid}-sug`}>
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button type="button" className="chip term-chip" onClick={() => fill(suggestion)} disabled={locked}>
                      <span className="visually-hidden">Preencher com </span>
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
              <span className="term-sug-note">Tocar preenche a linha; tecle Enter para executar.</span>
            </div>
          )}

          <p className="term-keys" id={`${uid}-keys`}>
            <span>
              <kbd>Enter</kbd> executa
            </span>
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> histórico
            </span>
            <span>
              <kbd>Tab</kbd> completa nomes
            </span>
            <span>
              <code>clear</code> limpa a tela
            </span>
          </p>
        </div>

        <SimGoalsPanel
          goals={step.goals.map((goal, i) => ({ label: goal.label, done: Boolean(goalStatus[i]) }))}
          locked={locked}
          onVerify={verify}
          shake={shake}
        />
      </div>
    </div>
  );
}
