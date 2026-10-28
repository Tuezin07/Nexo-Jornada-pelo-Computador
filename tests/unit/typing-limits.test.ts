import { describe, expect, it } from 'vitest';
import type { TypingStep } from '../../src/content/types';
import { evaluateTyping, MAX_PLAUSIBLE_WPM, replayTyping } from '../../src/domain/evaluators';

const step: TypingStep = {
  id: 't',
  kind: 'typing',
  title: 'T',
  prompt: 'Digite',
  hint: 'h',
  explanation: 'e',
  concept: 'digitacao-precisao',
  text: 'abcdefghij',
  minAccuracy: 0.9,
};

describe('limites da digitação', () => {
  it('limita a velocidade a um valor humanamente plausível (digitação automatizada)', () => {
    const log = [...'abcdefghij'].map((ch, i) => ({ ch, t: i * 0.5 }));
    expect(replayTyping(step.text, log).wpm).toBe(MAX_PLAUSIBLE_WPM);
  });

  it('arredonda a precisão para baixo na mensagem, sem mostrar a meta quando reprova', () => {
    // 10 acertos + 2 erros = 10/12 ≈ 83,3% (meta 90%)
    const log = [...'ab', 'x', ...'cdef', 'y', ...'ghij'].map((ch, i) => ({ ch, t: i * 300 }));
    const result = evaluateTyping(step, { kind: 'typing', log });
    expect(result.correct).toBe(false);
    expect(result.messages[0]).toContain('Precisão de 83%');
  });
});
