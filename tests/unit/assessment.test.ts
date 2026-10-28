import { describe, expect, it } from 'vitest';
import type { AssessmentQuestion, CategoryId, Difficulty } from '../../src/content/types';
import { CATEGORY_IDS } from '../../src/content/categories';
import {
  ASSESSMENT_LENGTH,
  assessmentVerdict,
  isAnswerCorrect,
  scoreAssessment,
  selectAssessmentQuestions,
  skippedAssessment,
} from '../../src/domain/assessment';
import { T0, makeQuestion } from '../helpers/fixtures';

/** Para cada categoria, uma pergunta fácil (1) e uma difícil (3). */
const POOL: AssessmentQuestion[] = CATEGORY_IDS.flatMap((c) => [makeQuestion(`${c}-1`, c, 1), makeQuestion(`${c}-3`, c, 3)]);

const pick = (pool: AssessmentQuestion[], level: Parameters<typeof selectAssessmentQuestions>[1], focus: CategoryId[] = []) =>
  selectAssessmentQuestions(pool, level, focus);

describe('selectAssessmentQuestions', () => {
  it(`seleciona ${ASSESSMENT_LENGTH} perguntas`, () => {
    expect(pick(POOL, 'iniciante')).toHaveLength(ASSESSMENT_LENGTH);
  });

  it('é determinística, independente da ordem do banco', () => {
    const a = pick(POOL, 'casual', ['redes']).map((q) => q.id);
    const shuffled = [...POOL].reverse();
    const b = pick(shuffled, 'casual', ['redes']).map((q) => q.id);
    expect(b).toEqual(a);
    expect(pick(POOL, 'casual', ['redes']).map((q) => q.id)).toEqual(a);
  });

  it('prioriza as áreas de foco', () => {
    const ids = pick(POOL, 'iniciante', ['seguranca', 'redes', 'comandos']).map((q) => q.category);
    expect(ids).toEqual(expect.arrayContaining(['seguranca', 'redes', 'comandos']));
  });

  it('áreas de foco entram mesmo quando estariam no fim da rotação', () => {
    // sem foco, "comandos" (última categoria) não entra para iniciante
    expect(pick(POOL, 'iniciante').map((q) => q.category)).not.toContain('comandos');
    expect(pick(POOL, 'iniciante', ['comandos']).map((q) => q.category)).toContain('comandos');
  });

  it('não repete categoria quando há opções', () => {
    for (const level of ['iniciante', 'casual', 'veterano', 'mestre'] as const) {
      const categories = pick(POOL, level, ['redes']).map((q) => q.category);
      expect(new Set(categories).size).toBe(categories.length);
    }
  });

  it('com poucas categorias, completa com perguntas restantes (sem repetir pergunta)', () => {
    const small = [
      makeQuestion('t1', 'teclado', 1),
      makeQuestion('t2', 'teclado', 2),
      makeQuestion('t3', 'teclado', 3),
      makeQuestion('s1', 'sistema', 1),
      makeQuestion('s2', 'sistema', 2),
      makeQuestion('s3', 'sistema', 3),
      makeQuestion('s4', 'sistema', 4),
    ];
    const ids = pick(small, 'casual').map((q) => q.id);
    expect(ids).toHaveLength(6);
    expect(new Set(ids).size).toBe(6);
  });

  it('banco menor que o tamanho da avaliação: usa todas', () => {
    const tiny = [makeQuestion('a', 'teclado', 1), makeQuestion('b', 'redes', 2)];
    expect(pick(tiny, 'mestre').map((q) => q.id).sort()).toEqual(['a', 'b']);
  });

  it('nível declarado puxa a dificuldade', () => {
    const sum = (qs: AssessmentQuestion[]) => qs.reduce((t, q) => t + q.difficulty, 0);
    const easy = pick(POOL, 'iniciante');
    const hard = pick(POOL, 'mestre');
    expect(easy.every((q) => q.difficulty === 1)).toBe(true);
    expect(sum(hard)).toBeGreaterThan(sum(easy));
    expect(hard.filter((q) => q.difficulty === 3)).toHaveLength(4);
  });

  it('resultado ordenado por dificuldade', () => {
    const difficulties = pick(POOL, 'veterano').map((q) => q.difficulty);
    expect(difficulties).toEqual([...difficulties].sort((a, b) => a - b));
  });
});

describe('pontuação', () => {
  const qs = [makeQuestion('f', 'teclado', 1), makeQuestion('m', 'teclado', 2), makeQuestion('d', 'redes', 3 as Difficulty)];

  it('isAnswerCorrect', () => {
    expect(isAnswerCorrect(qs[0]!, 'a')).toBe(true);
    expect(isAnswerCorrect(qs[0]!, 'b')).toBe(false);
    expect(isAnswerCorrect(qs[0]!, undefined)).toBe(false);
  });

  it('ponderada pela dificuldade, com acertos por categoria', () => {
    const record = scoreAssessment(qs, { f: 'a', m: 'b', d: 'a' }, T0);
    expect(record.score).toBeCloseTo((1 + 3) / 6, 3);
    expect(record.perCategory).toEqual({ teclado: { correct: 1, total: 2 }, redes: { correct: 1, total: 1 } });
    expect(record).toMatchObject({ completedAt: T0, skipped: false, questionIds: ['f', 'm', 'd'] });
  });

  it('acertar só a difícil vale mais que acertar só a fácil', () => {
    const onlyHard = scoreAssessment(qs, { d: 'a' }, T0).score;
    const onlyEasy = scoreAssessment(qs, { f: 'a' }, T0).score;
    expect(onlyHard).toBe(0.5);
    expect(onlyEasy).toBe(0.167);
  });

  it('sem perguntas: 0; pulada: registrada como pulada', () => {
    expect(scoreAssessment([], {}, T0).score).toBe(0);
    expect(skippedAssessment(T0)).toEqual({ completedAt: T0, skipped: true, score: 0, perCategory: {}, questionIds: [] });
  });

  it('veredito é ponto de partida, nunca bloqueio', () => {
    expect(assessmentVerdict(skippedAssessment(T0), 'mestre')).toMatch(/pulada/);
    expect(assessmentVerdict({ ...skippedAssessment(T0), skipped: false, score: 0.9 }, 'iniciante')).toMatch(/abrir mais cedo/);
    expect(assessmentVerdict({ ...skippedAssessment(T0), skipped: false, score: 0.2 }, 'mestre')).toMatch(/nada fica bloqueado/);
  });
});
