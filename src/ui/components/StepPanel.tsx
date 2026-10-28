/** Quadro de uma etapa: enunciado, desafio, retorno, pista, solução e avanço. */
import type { ReactNode } from 'react';
import type { MissionDefinition } from '../../content/types';
import { canReveal, type MissionRun } from '../../domain/engine';
import type { Evaluation, StepAnswer } from '../../domain/evaluators';
import type { Platform } from '../../domain/sim/keys';
import { ChallengeView, KIND_LABEL } from '../challenges/registry';
import { describeSolution } from '../challenges/solution';
import { Icon } from './Icon';
import { RichText } from './RichText';

interface Props {
  mission: MissionDefinition;
  run: MissionRun;
  evaluation: Evaluation | null;
  showHint: boolean;
  platform: Platform;
  preferVirtualKeyboard: boolean;
  submit: (answer: StepAnswer) => Evaluation;
  onHint: () => void;
  onReveal: () => void;
  onNext: () => void;
  nextLabel: ReactNode;
  busy?: boolean;
  label?: string;
}

export function StepPanel({ mission, run, evaluation, showHint, platform, preferVirtualKeyboard, submit, onHint, onReveal, onNext, nextLabel, busy, label }: Props) {
  const step = mission.steps[run.stepIndex];
  const progress = run.steps[run.stepIndex];
  if (!step || !progress) return null;

  return (
    <div className="player-stage page" key={step.id}>
      <div className="step-head enter">
        <div className="row">
          <span className="chip signal">{KIND_LABEL[step.kind]}</span>
          <span className="eyebrow">
            {label ?? 'Etapa'} {run.stepIndex + 1} de {mission.steps.length}
          </span>
        </div>
        <h1>{step.title}</h1>
        {step.context && <RichText className="step-context" text={step.context} />}
        <RichText className="step-prompt" text={step.prompt} />
      </div>

      <div className="step-body">
        <ChallengeView
          step={step}
          locked={progress.completed}
          revealed={progress.revealed}
          submit={submit}
          platform={platform}
          preferVirtualKeyboard={preferVirtualKeyboard}
        />
      </div>

      <div className="feedback" aria-live="polite">
        {!progress.completed && evaluation && !evaluation.correct && evaluation.messages.length > 0 && (
          <div className="callout error" key={progress.attempts}>
            <Icon name="x" />
            <div>
              <div className="callout-title">Ainda não</div>
              {evaluation.messages.map((m, i) => (
                <RichText key={i} text={m} />
              ))}
            </div>
          </div>
        )}
        {!progress.completed && showHint && (
          <div className="callout warn">
            <Icon name="hint" />
            <div>
              <div className="callout-title">Pista</div>
              <RichText text={step.hint} />
            </div>
          </div>
        )}
        {progress.completed && (
          <div className={`callout ${progress.revealed ? 'warn' : 'ok'} enter`}>
            <Icon name={progress.revealed ? 'eye' : 'check'} />
            <div className="stack" style={{ gap: 'var(--space-2)' }}>
              <div className="callout-title">{progress.revealed ? 'Solução' : progress.failures === 0 ? 'Correto de primeira!' : 'Correto!'}</div>
              {progress.revealed && describeSolution(step, platform).map((line, i) => <RichText key={i} text={line} />)}
              {!progress.revealed && evaluation?.correct && evaluation.messages.length > 0 && (
                <RichText className="muted" text={step.kind === 'quiz' ? evaluation.messages[0]! : evaluation.messages.join(' ')} />
              )}
              <RichText text={step.explanation} />
            </div>
          </div>
        )}
      </div>

      <div className="player-actions">
        {!progress.completed ? (
          <>
            {!showHint && (
              <button type="button" className="btn ghost" onClick={onHint}>
                <Icon name="hint" /> Pista <span className="faint">(−10% nesta etapa)</span>
              </button>
            )}
            {canReveal(run, step.id) && (
              <button type="button" className="btn" onClick={onReveal}>
                <Icon name="eye" /> Ver solução <span className="faint">(etapa vale 0)</span>
              </button>
            )}
          </>
        ) : (
          <button type="button" className="btn primary large" onClick={onNext} disabled={busy} autoFocus>
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
