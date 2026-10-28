import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { RichText } from '../components/RichText';
import { seededShuffle } from '../lib/shuffle';
import type { ChallengeProps } from './types';

export function ClassifyChallenge({ step, locked, revealed, submit }: ChallengeProps<'classify'>) {
  const items = useMemo(() => seededShuffle(step.items, step.id), [step]);
  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const showAnswers = locked || revealed;
  const effective = showAnswers ? Object.fromEntries(step.items.map((i) => [i.id, i.bucket])) : placement;
  const placed = Object.keys(placement).length;

  const assign = (itemId: string, bucket: string) => {
    if (showAnswers) return;
    setPlacement((p) => ({ ...p, [itemId]: bucket }));
    setWrongIds((w) => w.filter((id) => id !== itemId));
  };

  const check = () => {
    const evaluation = submit({ kind: 'classify', placement });
    if (!evaluation.correct && placed === step.items.length) {
      setWrongIds(step.items.filter((i) => placement[i.id] !== i.bucket).map((i) => i.id));
    }
  };

  return (
    <div className="challenge">
      <div className="bucket-legend" aria-label="Grupos">
        {step.buckets.map((b) => (
          <div key={b.id}>
            <strong>{b.label}</strong>
            {b.description && <span className="muted">{b.description}</span>}
            <div className="count">{Object.values(effective).filter((v) => v === b.id).length} item(ns)</div>
          </div>
        ))}
      </div>
      <div className="classify-pool">
        {items.map((item) => {
          const isWrong = wrongIds.includes(item.id) && !showAnswers;
          return (
            <div
              key={item.id}
              className={`classify-item ${isWrong ? 'is-wrong' : ''} ${showAnswers ? 'is-right' : ''}`}
              role="group"
              aria-label={item.text}
            >
              <span className="text">
                {isWrong && <Icon name="x" size={16} label="Grupo incorreto" />} <RichText as="inline" text={item.text} />
              </span>
              <span className="choices">
                {step.buckets.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className="bucket-btn"
                    aria-pressed={effective[item.id] === b.id}
                    onClick={() => assign(item.id, b.id)}
                    disabled={showAnswers}
                  >
                    {b.label}
                  </button>
                ))}
              </span>
            </div>
          );
        })}
      </div>
      {!locked && (
        <div className="challenge-actions">
          <button type="button" className="btn primary" onClick={check} disabled={placed < step.items.length}>
            <Icon name="check" /> Verificar grupos
          </button>
          <span className="note">
            {placed} de {step.items.length} classificados
          </span>
        </div>
      )}
    </div>
  );
}
