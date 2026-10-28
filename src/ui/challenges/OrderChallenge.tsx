import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { RichText } from '../components/RichText';
import { seededShuffle } from '../lib/shuffle';
import type { ChallengeProps } from './types';

export function OrderChallenge({ step, locked, revealed, submit }: ChallengeProps<'order'>) {
  const initial = useMemo(() => {
    const ids = step.items.map((i) => i.id);
    let shuffled = seededShuffle(ids, step.id);
    if (shuffled.every((id, i) => id === ids[i])) shuffled = [...shuffled.slice(1), shuffled[0]!];
    return shuffled;
  }, [step]);
  const [order, setOrder] = useState<string[]>(initial);
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [moved, setMoved] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const correctOrder = step.items.map((i) => i.id);
  const display = locked || revealed ? correctOrder : order;
  const textOf = (id: string) => step.items.find((i) => i.id === id)?.text ?? id;

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setOrder(next);
    setMoved(next[target]!);
    setChecked(null);
    setAnnouncement(`Item movido para a posição ${target + 1}.`);
  };

  const check = () => {
    const evaluation = submit({ kind: 'order', order });
    if (!evaluation.correct) setChecked(order.map((id, i) => id === correctOrder[i]));
  };

  return (
    <div className="challenge">
      <p className="faint" style={{ fontSize: '0.85rem' }}>
        Use as setas para colocar as etapas na ordem certa, de cima para baixo.
      </p>
      <ol className="order-list">
        {display.map((id, index) => {
          const right = locked || revealed || checked?.[index];
          return (
            <li key={id} className={`order-item ${moved === id && !locked ? 'moved' : ''} ${right ? 'is-right' : ''}`}>
              <span className="pos" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <RichText as="inline" text={textOf(id)} />
                {checked && !checked[index] && !locked && <span className="visually-hidden"> (fora de posição)</span>}
                {checked?.[index] && !locked && <span className="visually-hidden"> (posição correta)</span>}
              </span>
              {locked || revealed ? (
                <Icon name="check" size={18} className="ok-icon" />
              ) : (
                <span className="moves">
                  <button
                    type="button"
                    className="btn small icon-only"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Mover "${textOf(id).slice(0, 40)}" para cima`}
                  >
                    <Icon name="arrow-up" size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn small icon-only"
                    onClick={() => move(index, 1)}
                    disabled={index === display.length - 1}
                    aria-label={`Mover "${textOf(id).slice(0, 40)}" para baixo`}
                  >
                    <Icon name="arrow-down" size={16} />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
      {!locked && (
        <div className="challenge-actions">
          <button type="button" className="btn primary" onClick={check}>
            <Icon name="check" /> Verificar ordem
          </button>
          {checked && <span className="note">Itens com borda verde já estão no lugar certo.</span>}
        </div>
      )}
    </div>
  );
}
