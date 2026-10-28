/**
 * Desafio de digitação no modo "para no erro": a tecla errada não avança e conta
 * como erro. Toda métrica (posição, erros, precisão, ppm) vem de `replayTyping`,
 * calculada sobre o registro de teclas; o componente não mantém contadores próprios.
 */
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type CompositionEvent,
  type CSSProperties,
  type DragEvent,
  type FormEvent,
} from 'react';
import { replayTyping, type Evaluation, type TypingKey } from '../../domain/evaluators';
import { Icon } from '../components/Icon';
import type { ChallengeProps } from './types';
import './Typing.css';

function charLabel(ch: string): string {
  if (ch === ' ') return 'espaço';
  return `“${ch}”`;
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Índices (exclusivos) onde cada palavra termina. */
function wordEnds(text: string): number[] {
  const ends: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== ' ' && (i + 1 === text.length || text[i + 1] === ' ')) ends.push(i + 1);
  }
  return ends;
}

const percent = (accuracy: number) => Math.floor(accuracy * 100);

const WPM_MIN_SAMPLE_MS = 2000;

export function TypingChallenge({ step, locked, submit }: ChallengeProps<'typing'>) {
  const text = step.text;
  const ends = useMemo(() => wordEnds(text), [text]);
  const [log, setLogState] = useState<TypingKey[]>([]);
  const logRef = useRef<TypingKey[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [focused, setFocused] = useState(false);
  const [errorFlash, setErrorFlash] = useState<{ position: number; tick: number } | null>(null);
  const [lastWrong, setLastWrong] = useState<{ got: string; want: string } | null>(null);
  const [notice, setNotice] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [now, setNow] = useState(() => performance.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const composingRef = useRef(false);
  const textId = useId();
  const statusId = useId();

  const replay = useMemo(() => replayTyping(text, log), [text, log]);
  const started = log.length > 0;
  const finished = replay.completed;
  const running = started && !finished && !locked;
  const firstKey = log[0];

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(performance.now()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = !firstKey ? 0 : running ? Math.max(replay.durationMs, now - firstKey.t) : replay.durationMs;
  const wordsDone = (position: number) => ends.filter((end) => position >= end).length;

  const setLog = (next: TypingKey[]) => {
    logRef.current = next;
    setLogState(next);
  };

  const processText = (raw: string) => {
    if (!raw || locked) return;
    const before = replayTyping(text, logRef.current);
    if (before.completed) return;
    const next = [...logRef.current];
    let wrong: { got: string; want: string } | null = null;
    for (const ch of Array.from(raw.normalize('NFC'))) {
      const prev = replayTyping(text, next);
      if (prev.completed) break;
      next.push({ ch, t: performance.now() });
      const after = replayTyping(text, next);
      if (after.mistakes > prev.mistakes) wrong = { got: ch, want: text[prev.position] ?? '' };
      else wrong = null;
    }
    if (next.length === logRef.current.length) return;
    setLog(next);
    setNotice('');
    const after = replayTyping(text, next);
    if (wrong) {
      setLastWrong(wrong);
      setErrorFlash((f) => ({ position: after.position, tick: (f?.tick ?? 0) + 1 }));
    } else if (after.position > before.position) {
      setLastWrong(null);
    }

    if (after.completed) {
      const result = submit({ kind: 'typing', log: next });
      setEvaluation(result);
      setAnnouncement(
        `Texto concluído. Precisão de ${percent(after.accuracy)}%, ${after.wpm} palavras por minuto.${result.correct ? '' : ' Precisão abaixo da meta.'}`,
      );
      if (!result.correct) window.setTimeout(() => retryRef.current?.focus(), 0);
      return;
    }
    const doneBefore = wordsDone(before.position);
    const doneAfter = wordsDone(after.position);
    if (doneAfter > doneBefore) setAnnouncement(`Palavra ${doneAfter} de ${ends.length} concluída.`);
  };

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const native = event.nativeEvent as InputEvent;
    if (composingRef.current || native.isComposing) return;
    const el = event.currentTarget;
    const value = el.value;
    el.value = '';
    processText(value);
  };

  const onCompositionStart = () => {
    composingRef.current = true;
  };

  const onCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    composingRef.current = false;
    const el = event.currentTarget;
    const value = el.value;
    el.value = '';
    processText(value);
  };

  const blockPaste = (event: ClipboardEvent<HTMLInputElement> | DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNotice('Colar está desativado aqui: digite o texto.');
  };

  const reset = () => {
    setLog([]);
    setEvaluation(null);
    setLastWrong(null);
    setErrorFlash(null);
    setNotice('');
    setAnnouncement('Texto reiniciado. Comece a digitar.');
    if (inputRef.current) inputRef.current.value = '';
    inputRef.current?.focus();
  };

  const focusInput = () => {
    if (!locked) inputRef.current?.focus();
  };

  // Nos primeiros instantes a duração é mínima e a ppm dispara; espere um pouco de amostra.
  const wpmReady = finished || replay.durationMs >= WPM_MIN_SAMPLE_MS;
  const accuracyPct = percent(replay.accuracy);
  const goalPct = Math.round(step.minAccuracy * 100);
  const belowGoal = started && replay.accuracy < step.minAccuracy;
  const progressPct = text.length > 0 ? Math.round((replay.position / text.length) * 100) : 0;
  const showCover = !focused && !finished && !locked;
  const flashClass = errorFlash && errorFlash.position === replay.position ? `tp-err-${errorFlash.tick % 2}` : '';

  return (
    <div className="challenge typing">
      <div className="tp-metrics" aria-label="Desempenho">
        <div className={`tp-metric is-speed`}>
          <span className="eyebrow">
            <Icon name="bolt" size={14} /> Velocidade
          </span>
          <span className="tp-value">
            <strong>{wpmReady ? replay.wpm : '—'}</strong> <span className="tp-unit">ppm</span>
          </span>
          <span className="tp-goal faint">{step.targetWpm ? `meta opcional: ${step.targetWpm} ppm` : 'palavras por minuto'}</span>
        </div>
        <div className={`tp-metric is-accuracy ${belowGoal ? 'is-below' : ''}`}>
          <span className="eyebrow">
            <Icon name="target" size={14} /> Precisão
          </span>
          <span className="tp-value">
            <strong>{started ? accuracyPct : '—'}</strong> <span className="tp-unit">%</span>
          </span>
          <span className="tp-goal">
            meta: {goalPct}%{belowGoal ? <span className="tp-below"> · abaixo da meta</span> : started ? ' · dentro da meta' : ''}
          </span>
        </div>
        <div className="tp-metric">
          <span className="eyebrow">
            <Icon name="x" size={14} /> Erros
          </span>
          <span className="tp-value">
            <strong>{replay.mistakes}</strong>
          </span>
          <span className="tp-goal faint">teclas erradas</span>
        </div>
        <div className="tp-metric">
          <span className="eyebrow">
            <Icon name="clock" size={14} /> Tempo
          </span>
          <span className="tp-value">
            <strong className="mono">{formatTime(elapsed)}</strong>
          </span>
          <span className="tp-goal faint">{started ? (running ? 'contando' : 'parado') : 'começa na 1ª tecla'}</span>
        </div>
      </div>

      <div
        className={`tp-box ${focused ? 'is-focused' : ''} ${finished ? 'is-finished' : ''} ${locked ? 'is-locked' : ''}`}
        onClick={focusInput}
      >
        <p id={textId} className="visually-hidden">
          Texto para digitar: {text}
        </p>
        <div className="tp-text" aria-hidden="true">
          {text.split('').map((ch, index) => {
            const state = index < replay.position ? 'tp-done' : index === replay.position && !finished ? `tp-current ${flashClass}` : 'tp-todo';
            return (
              <span key={index} className={`${state} ${ch === ' ' ? 'tp-space' : ''}`}>
                {ch}
              </span>
            );
          })}
        </div>
        <input
          ref={inputRef}
          className="tp-input"
          type="text"
          aria-label="Campo de digitação: digite o texto exibido"
          aria-describedby={`${textId} ${statusId}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="text"
          disabled={locked}
          readOnly={finished}
          onInput={onInput}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onPaste={blockPaste}
          onDrop={blockPaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {showCover && (
          <div className="tp-cover" aria-hidden="true">
            <span>
              <Icon name="keyboard" size={18} /> {started ? 'Clique aqui para continuar digitando' : 'Clique aqui e comece a digitar'}
            </span>
          </div>
        )}
      </div>

      <div className="tp-progress">
        <div
          className="meter"
          role="progressbar"
          aria-label="Progresso no texto"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
          style={{ '--value': `${progressPct}%` } as CSSProperties}
        >
          <span />
        </div>
        <span className="faint mono">
          {replay.position}/{text.length} caracteres
        </span>
      </div>

      <div className="tp-status-slot">
        <p id={statusId} className={`tp-status ${lastWrong && !notice ? 'is-error' : ''}`} aria-live="polite">
          {notice ? (
            notice
          ) : lastWrong ? (
            <>
              <Icon name="x" size={16} /> Tecla errada: você digitou {charLabel(lastWrong.got)}; o próximo caractere é {charLabel(lastWrong.want)}.
            </>
          ) : null}
        </p>
        {!notice && !lastWrong && !finished && (
          <p className="tp-help faint">
            Modo “para no erro”: uma tecla errada não avança e conta como erro. <strong>Velocidade</strong> é quanto você digita por minuto;{' '}
            <strong>precisão</strong> é a porcentagem de teclas certas.
          </p>
        )}
      </div>

      {finished && evaluation && (
        <div className={`callout ${evaluation.correct ? 'ok' : 'error'}`}>
          <Icon name={evaluation.correct ? 'check' : 'alert'} />
          <div>
            <p className="callout-title">
              {evaluation.correct ? 'Texto concluído' : 'Precisão abaixo da meta'}
            </p>
            <p>
              Precisão de {accuracyPct}% (meta: {goalPct}%) a {replay.wpm} ppm, com {replay.mistakes}{' '}
              {replay.mistakes === 1 ? 'erro' : 'erros'} em {formatTime(replay.durationMs)}.
              {!evaluation.correct && ' Vá com calma: a velocidade vem depois da precisão.'}
            </p>
          </div>
        </div>
      )}

      {!locked && (finished ? evaluation && !evaluation.correct : started) && (
        <div className="challenge-actions">
          {finished ? (
            <button ref={retryRef} type="button" className="btn primary" onClick={reset}>
              <Icon name="refresh" /> Tentar de novo
            </button>
          ) : (
            <button type="button" className="btn small ghost" onClick={reset}>
              <Icon name="restore" size={16} /> Recomeçar
            </button>
          )}
        </div>
      )}

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
