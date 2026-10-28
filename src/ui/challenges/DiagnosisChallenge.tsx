import { useEffect, useMemo, useRef, useState } from 'react';
import type { DiagnosisAction } from '../../content/types';
import { replayDiagnosis } from '../../domain/evaluators';
import { Icon, type IconName } from '../components/Icon';
import { RichText } from '../components/RichText';
import { seededShuffle } from '../lib/shuffle';
import type { ChallengeProps } from './types';

const QUALITY: Record<DiagnosisAction['quality'], { label: string; icon: IconName }> = {
  best: { label: 'Ótimo passo', icon: 'check' },
  good: { label: 'Funciona, mas há caminho melhor', icon: 'check' },
  poor: { label: 'Não ajudou agora', icon: 'x' },
  harmful: { label: 'Ação arriscada', icon: 'alert' },
};

export function DiagnosisChallenge({ step, locked, submit }: ChallengeProps<'diagnosis'>) {
  const [trace, setTrace] = useState<string[]>([]);
  const submitted = useRef(false);
  const replay = useMemo(() => replayDiagnosis(step, trace), [step, trace]);
  const stage = step.stages.find((s) => s.id === replay.stageId) ?? step.stages[0]!;
  const allActions = useMemo(() => new Map(step.stages.flatMap((s) => s.actions.map((a) => [a.id, a] as const))), [step]);

  useEffect(() => {
    if (replay.resolved && !submitted.current) {
      submitted.current = true;
      submit({ kind: 'diagnosis', trace });
    }
  }, [replay.resolved, submit, trace]);

  const choose = (id: string) => {
    if (locked || replay.resolved) return;
    setTrace((t) => [...t, id]);
  };

  return (
    <div className="challenge">
      <div className="diag-symptom">
        <Icon name="alert" size={22} />
        <div>
          <div className="eyebrow">Sintoma relatado</div>
          <RichText text={step.symptom} />
        </div>
      </div>

      {trace.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Registro da investigação
          </div>
          <ol className="diag-log" aria-live="polite">
            {trace.map((id, i) => {
              const action = allActions.get(id);
              if (!action) return null;
              const q = QUALITY[action.quality];
              return (
                <li key={`${id}-${i}`}>
                  <span className={`q q-${action.quality}`}>
                    <Icon name={q.icon} size={14} /> {q.label}
                  </span>
                  <div style={{ fontWeight: 700 }}>
                    <RichText as="inline" text={action.label} />
                  </div>
                  <RichText className="muted" text={action.result} />
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {!replay.resolved && !locked ? (
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <div>
            <div className="eyebrow accent">Situação atual</div>
            <RichText text={stage.situation} />
          </div>
          {stage.evidence && stage.evidence.length > 0 && (
            <ul className="diag-evidence" aria-label="Observações">
              {stage.evidence.map((e, i) => (
                <li key={i}>
                  <RichText as="inline" text={e} />
                </li>
              ))}
            </ul>
          )}
          <div className="eyebrow">O que você faz agora?</div>
          <div className="diag-actions">
            {seededShuffle(stage.actions, `${step.id}-${stage.id}`).map((a) => (
              <button key={a.id} type="button" className="diag-action" onClick={() => choose(a.id)} disabled={replay.triedInStage.includes(a.id)}>
                <RichText as="inline" text={a.label} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="callout ok">
          <Icon name="check" />
          <div>
            <div className="callout-title">Problema resolvido</div>
            <span className="muted">
              {replay.counts.harmful > 0
                ? 'Resolvido, mas houve ações arriscadas no caminho. Revise o registro acima.'
                : replay.counts.poor > 0
                  ? 'Resolvido. Algumas tentativas não ajudaram; o registro mostra por quê.'
                  : 'Investigação limpa: cada passo foi seguro e útil.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
