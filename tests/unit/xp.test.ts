import { describe, expect, it } from 'vitest';
import {
  BASE_XP,
  REVIEW_INTERVAL_HOURS,
  TRAINING_DAILY_CAP,
  TRAINING_XP_PER_ANSWER,
  computeMissionXp,
  levelFromXp,
  maxFirstCompletionXp,
  missionBaseXp,
  rankForLevel,
  totalXpForLevel,
  trainingXp,
  xpForNextLevel,
  type MissionXpInput,
} from '../../src/domain/xp';
import { HOUR, T0, makeMission } from '../helpers/fixtures';

const input = (patch: Partial<MissionXpInput> = {}): MissionXpInput => ({
  base: 100,
  accuracy: 0.8,
  passed: true,
  previousBest: 0,
  completedBefore: false,
  lastReviewXpAt: null,
  lastCompletedAt: null,
  now: T0,
  ...patch,
});

/** Entrada de uma missão já concluída antes (recorde anterior e data informados). */
const repeat = (patch: Partial<MissionXpInput> = {}): MissionXpInput =>
  input({ completedBefore: true, previousBest: 0.9, accuracy: 0.9, lastCompletedAt: T0 - HOUR, ...patch });

describe('base de XP da missão', () => {
  it('soma BASE_XP da dificuldade e 5 por etapa', () => {
    expect(missionBaseXp(makeMission({ id: 'x', difficulty: 1, stepCount: 3 }))).toBe(BASE_XP[1] + 15);
    expect(missionBaseXp(makeMission({ id: 'x', difficulty: 4, stepCount: 6 }))).toBe(150 + 30);
  });

  it('o máximo da primeira conclusão inclui o bônus de 10%', () => {
    const mission = makeMission({ id: 'x', difficulty: 2, stepCount: 3 }); // base 90
    expect(maxFirstCompletionXp(mission)).toBe(99);
  });
});

describe('computeMissionXp', () => {
  it('primeira conclusão: base × (0,5 + 0,5 × precisão)', () => {
    const r = computeMissionXp(input({ accuracy: 0.8 }));
    expect(r.total).toBe(90);
    expect(r.isFirstCompletion).toBe(true);
    expect(r.isReview).toBe(false);
    expect(r.lines).toHaveLength(1);
  });

  it('primeira conclusão com a precisão mínima de aprovação rende 80% da base', () => {
    expect(computeMissionXp(input({ accuracy: 0.6 })).total).toBe(80);
  });

  it('precisão de 100% soma bônus de 10% da base', () => {
    const r = computeMissionXp(input({ accuracy: 1 }));
    expect(r.total).toBe(110);
    expect(r.lines.map((l) => l.xp)).toEqual([100, 10]);
  });

  it('sem bônus quando a precisão não é perfeita', () => {
    const r = computeMissionXp(input({ accuracy: 0.9 }));
    expect(r.total).toBe(95);
    expect(r.lines).toHaveLength(1);
  });

  it('precisão fora de 0..1 é limitada', () => {
    expect(computeMissionXp(input({ accuracy: 1.7 })).total).toBe(110);
  });

  it('melhoria de recorde: base × 0,5 × (nova − anterior), mesmo dentro do intervalo de revisão', () => {
    const r = computeMissionXp(repeat({ previousBest: 0.7, accuracy: 0.9 }));
    expect(r.total).toBe(10);
    expect(r.isReview).toBe(false);
    expect(r.isFirstCompletion).toBe(false);
  });

  it('revisão só depois de REVIEW_INTERVAL_HOURS desde a última conclusão', () => {
    expect(REVIEW_INTERVAL_HOURS).toBe(20);
    const early = computeMissionXp(repeat({ previousBest: 1, accuracy: 1, lastCompletedAt: T0 - 19.9 * HOUR }));
    expect(early.total).toBe(0);
    expect(early.isReview).toBe(false);

    const onTime = computeMissionXp(repeat({ previousBest: 1, accuracy: 1, lastCompletedAt: T0 - 20 * HOUR }));
    expect(onTime.isReview).toBe(true);
    expect(onTime.total).toBe(20); // base × 0,2 × precisão
  });

  it('revisão proporcional à precisão', () => {
    const r = computeMissionXp(repeat({ previousBest: 1, accuracy: 0.75, lastCompletedAt: T0 - 30 * HOUR }));
    expect(r.total).toBe(15);
  });

  it('XP de revisão no máximo uma vez a cada intervalo, mesmo que a conclusão seja antiga', () => {
    const r = computeMissionXp(repeat({ previousBest: 1, accuracy: 1, lastCompletedAt: T0 - 30 * HOUR, lastReviewXpAt: T0 - 10 * HOUR }));
    expect(r.isReview).toBe(false);
    expect(r.total).toBe(0);
  });

  it('recorde e revisão podem se somar', () => {
    const r = computeMissionXp(repeat({ previousBest: 0.6, accuracy: 1, lastCompletedAt: T0 - 25 * HOUR }));
    expect(r.lines.map((l) => l.xp)).toEqual([20, 20]);
    expect(r.total).toBe(40);
  });

  it('repetição dentro do intervalo, sem novo recorde: 0 XP', () => {
    const same = computeMissionXp(repeat());
    expect(same.total).toBe(0);
    expect(same.lines).toEqual([]);
    const worse = computeMissionXp(repeat({ accuracy: 0.7 }));
    expect(worse.total).toBe(0);
  });

  it('missão não aprovada: 0 XP, na primeira vez ou não', () => {
    const first = computeMissionXp(input({ passed: false, accuracy: 0.5 }));
    expect(first).toEqual({ total: 0, lines: [], isReview: false, isFirstCompletion: false });
    const later = computeMissionXp(repeat({ passed: false, accuracy: 0.5, lastCompletedAt: T0 - 48 * HOUR }));
    expect(later.total).toBe(0);
    expect(later.isReview).toBe(false);
  });
});

describe('níveis', () => {
  it('passar do nível n para n+1 custa 100 + 40 × (n − 1)', () => {
    expect(xpForNextLevel(1)).toBe(100);
    expect(xpForNextLevel(2)).toBe(140);
    expect(xpForNextLevel(5)).toBe(260);
  });

  it('XP acumulado exato por nível', () => {
    expect(totalXpForLevel(1)).toBe(0);
    expect(totalXpForLevel(2)).toBe(100);
    expect(totalXpForLevel(3)).toBe(240);
    expect(totalXpForLevel(4)).toBe(420);
    expect(totalXpForLevel(5)).toBe(640);
    expect(totalXpForLevel(0)).toBe(0);
  });

  it('totalXpForLevel é a soma dos custos de cada nível', () => {
    for (let n = 1; n < 40; n++) expect(totalXpForLevel(n + 1) - totalXpForLevel(n)).toBe(xpForNextLevel(n));
  });

  it('limites exatos de levelFromXp', () => {
    expect(levelFromXp(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForNext: 100, progress: 0, totalXp: 0 });
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100)).toEqual({ level: 2, xpIntoLevel: 0, xpForNext: 140, progress: 0, totalXp: 100 });
    expect(levelFromXp(239).level).toBe(2);
    expect(levelFromXp(240).level).toBe(3);
    expect(levelFromXp(419).level).toBe(3);
    expect(levelFromXp(420).level).toBe(4);
    const mid = levelFromXp(170);
    expect(mid.xpIntoLevel).toBe(70);
    expect(mid.progress).toBeCloseTo(0.5);
  });

  it('no limite de cada nível sobe; um XP antes, não', () => {
    for (let n = 2; n <= 30; n++) {
      expect(levelFromXp(totalXpForLevel(n)).level).toBe(n);
      expect(levelFromXp(totalXpForLevel(n) - 1).level).toBe(n - 1);
    }
  });

  it('XP negativo ou fracionado é tratado sem quebrar', () => {
    expect(levelFromXp(-50)).toMatchObject({ level: 1, totalXp: 0 });
    expect(levelFromXp(100.9)).toMatchObject({ level: 2, totalXp: 100 });
  });
});

describe('trainingXp', () => {
  it('TRAINING_XP_PER_ANSWER por acerto de primeira', () => {
    expect(trainingXp(5, 0)).toBe(5 * TRAINING_XP_PER_ANSWER);
  });

  it('limitado a TRAINING_DAILY_CAP por dia', () => {
    expect(trainingXp(100, 0)).toBe(TRAINING_DAILY_CAP);
    expect(trainingXp(10, 50)).toBe(10);
    expect(trainingXp(10, TRAINING_DAILY_CAP)).toBe(0);
  });

  it('nunca negativo, mesmo se o registro do dia passou do limite', () => {
    expect(trainingXp(10, TRAINING_DAILY_CAP + 30)).toBe(0);
    expect(trainingXp(0, 0)).toBe(0);
  });
});

describe('rankForLevel', () => {
  it.each([
    [0, 'Visitante'],
    [1, 'Visitante'],
    [2, 'Aprendiz'],
    [3, 'Aprendiz'],
    [4, 'Explorador'],
    [6, 'Operador'],
    [8, 'Técnico'],
    [9, 'Técnico'],
    [10, 'Especialista'],
    [12, 'Especialista'],
    [13, 'Arquiteto'],
    [16, 'Root'],
    [60, 'Root'],
  ])('nível %i → %s', (level, title) => {
    expect(rankForLevel(level)).toBe(title);
  });
});
