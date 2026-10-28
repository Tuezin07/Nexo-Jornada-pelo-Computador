import { useMemo, useState } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { RichText } from '../components/RichText';
import { seededShuffle } from '../lib/shuffle';
import type { ChallengeProps } from './types';

const ARTIFACT: Record<string, { label: string; icon: IconName }> = {
  email: { label: 'Caixa de entrada · mensagem recebida', icon: 'mail' },
  sms: { label: 'Mensagens · SMS recebido', icon: 'phone' },
  site: { label: 'Navegador · página aberta', icon: 'globe' },
  download: { label: 'Downloads · arquivo baixado', icon: 'download' },
  popup: { label: 'Janela pop-up', icon: 'window' },
};

export function InspectChallenge({ step, locked, revealed, submit }: ChallengeProps<'inspect'>) {
  const [flagged, setFlagged] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [falseFlags, setFalseFlags] = useState<string[]>([]);
  const showAnswers = locked || revealed;
  const meta = ARTIFACT[step.artifact] ?? ARTIFACT.email!;
  const verdictOptions = useMemo(() => seededShuffle(step.verdict.options, `${step.id}-veredito`), [step]);

  const toggle = (id: string) => {
    if (showAnswers) return;
    setFlagged((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    setFalseFlags((f) => f.filter((x) => x !== id));
  };

  const check = () => {
    const evaluation = submit({ kind: 'inspect', flagged, verdict });
    if (!evaluation.correct) setFalseFlags(step.parts.filter((p) => !p.suspicious && flagged.includes(p.id)).map((p) => p.id));
  };

  return (
    <div className="challenge">
      <p className="faint" style={{ fontSize: '0.85rem' }}>
        Toque nas partes que parecem suspeitas para marcá-las. Toque de novo para desmarcar.
      </p>
      <div className="artifact">
        <div className="artifact-head">
          <Icon name={meta.icon} size={16} /> {meta.label}
        </div>
        <div className="artifact-parts">
          {step.parts.map((part) => {
            const isFlagged = flagged.includes(part.id);
            const revealClass = showAnswers ? (part.suspicious ? 'revealed-suspicious' : 'revealed-ok') : '';
            return (
              <button
                key={part.id}
                type="button"
                className={`part ${revealClass}`}
                aria-pressed={showAnswers ? undefined : isFlagged}
                onClick={() => toggle(part.id)}
                disabled={showAnswers}
              >
                <span className="field">{part.field}</span>
                <span>
                  <RichText as="inline" text={part.text} />
                </span>
                <span className="flag">
                  {showAnswers ? (
                    part.suspicious ? (
                      <>
                        <Icon name="alert" size={14} /> Sinal de alerta
                      </>
                    ) : (
                      <>
                        <Icon name="check" size={14} /> Normal
                      </>
                    )
                  ) : isFlagged ? (
                    <>
                      <Icon name="flag" size={14} /> Suspeito
                    </>
                  ) : (
                    <span className="visually-hidden">Não marcado</span>
                  )}
                </span>
                {(showAnswers || falseFlags.includes(part.id)) && (
                  <span className="why">
                    <RichText as="inline" text={part.explanation} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <fieldset className="options">
        <legend style={{ fontWeight: 700, marginBottom: 8 }}>
          <RichText as="inline" text={step.verdict.question} />
        </legend>
        {verdictOptions.map((o) => (
          <label key={o.id} className={`option ${showAnswers && o.correct ? 'is-right' : ''} ${showAnswers ? 'is-locked' : ''}`}>
            <input type="radio" name={`verdict-${step.id}`} checked={verdict === o.id} onChange={() => setVerdict(o.id)} disabled={showAnswers} />
            <span className="letter" aria-hidden="true">
              <Icon name={showAnswers && o.correct ? 'check' : 'chevron-right'} size={14} />
            </span>
            <RichText as="inline" text={o.text} />
            <span />
          </label>
        ))}
      </fieldset>

      {!locked && (
        <div className="challenge-actions">
          <button type="button" className="btn primary" onClick={check} disabled={!verdict}>
            <Icon name="check" /> Verificar análise
          </button>
          <span className="note">{flagged.length} parte(s) marcada(s)</span>
        </div>
      )}
    </div>
  );
}
