import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { RichText } from '../components/RichText';
import { seededShuffle } from '../lib/shuffle';
import type { ChallengeProps } from './types';

const LETTERS = 'ABCDEFGH';

export function QuizChallenge({ step, locked, revealed, submit }: ChallengeProps<'quiz'>) {
  const [selected, setSelected] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [shake, setShake] = useState(0);
  const multiple = Boolean(step.multiple);
  // Ordem embaralhada de forma estável: a posição da alternativa certa não dá pista.
  const options = useMemo(() => seededShuffle(step.options, step.id), [step]);

  const toggle = (id: string) => {
    if (locked) return;
    setSelected((current) => (multiple ? (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]) : [id]));
  };

  const check = () => {
    const evaluation = submit({ kind: 'quiz', selected });
    if (!evaluation.correct) {
      const wrongPicks = step.options.filter((o) => selected.includes(o.id) && !o.correct).map((o) => o.id);
      setWrong((w) => [...new Set([...w, ...wrongPicks])]);
      if (!multiple) setSelected([]);
      setShake((n) => n + 1);
    }
  };

  const showAnswers = locked || revealed;

  return (
    <div className="challenge">
      <fieldset className={`options ${shake ? 'shake' : ''}`} key={shake} aria-describedby={`${step.id}-instr`}>
        <legend className="visually-hidden">{multiple ? 'Marque todas as corretas' : 'Escolha uma alternativa'}</legend>
        <p id={`${step.id}-instr`} className="faint" style={{ fontSize: '0.85rem', marginBottom: 4 }}>
          {multiple ? 'Marque todas as alternativas corretas.' : 'Escolha uma alternativa.'}
        </p>
        {options.map((option, index) => {
          const isWrong = wrong.includes(option.id) && !showAnswers;
          const isRight = showAnswers && option.correct;
          const disabledWrong = !multiple && wrong.includes(option.id);
          const classes = ['option', isWrong ? 'is-wrong' : '', isRight ? 'is-right' : '', locked ? 'is-locked' : ''].join(' ');
          return (
            <label key={option.id} className={classes}>
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={`quiz-${step.id}`}
                checked={selected.includes(option.id)}
                onChange={() => toggle(option.id)}
                disabled={locked || disabledWrong}
              />
              <span className="letter" aria-hidden="true">
                {LETTERS[index]}
              </span>
              <RichText as="inline" text={option.text} />
              {isRight ? (
                <span className="mark">
                  <Icon name="check" size={16} /> Correta
                </span>
              ) : isWrong ? (
                <span className="mark">
                  <Icon name="x" size={16} /> Incorreta
                </span>
              ) : (
                <span />
              )}
            </label>
          );
        })}
      </fieldset>
      {!locked && (
        <div className="challenge-actions">
          <button type="button" className="btn primary" onClick={check} disabled={selected.length === 0}>
            <Icon name="check" /> Confirmar resposta
          </button>
        </div>
      )}
    </div>
  );
}
