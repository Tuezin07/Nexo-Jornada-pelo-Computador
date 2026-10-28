import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../../src/content/categories';
import { CONCEPT_IDS } from '../../src/content/concepts';
import { applyMissionResult } from '../../src/domain/progress';
import { MIN_STEPS_FOR_ACCURACY, buildStats } from '../../src/domain/stats';
import { dayKey, type GameState } from '../../src/domain/state';
import { DAY, MINUTE, MISSION_A, MISSION_C, T0, freshState, playQuizMission, syntheticCatalog, withCompleted } from '../helpers/fixtures';

const catalog = syntheticCatalog();

describe('sem dados', () => {
  it('não inventa números: campos ficam nulos', () => {
    const report = buildStats(freshState(), catalog, T0);
    expect(report).toMatchObject({
      missionsStarted: 0,
      runsCompleted: 0,
      runsFailed: 0,
      uniqueCompleted: 0,
      totalMissions: catalog.missions.length,
      completionRate: null,
      overallAccuracy: null,
      averageRunMs: null,
      totalTimeMs: 0,
      totalAttempts: 0,
      streak: { current: 0, longest: 0 },
      strengths: [],
      weaknesses: [],
      needsReview: [],
      bestTypingWpm: 0,
    });
    expect(report.categories).toHaveLength(CATEGORIES.length);
    for (const c of report.categories) {
      expect(c.accuracy).toBeNull();
      expect(c.firstTryRate).toBeNull();
      expect(c.trend).toEqual([]);
      expect(c.steps).toBe(0);
    }
    expect(report.mastery['nao-estudado']).toHaveLength(CONCEPT_IDS.length);
  });

  it(`precisão por categoria só com pelo menos ${MIN_STEPS_FOR_ACCURACY} etapas`, () => {
    const state = freshState();
    state.progress.stats.categories.arquivos = { steps: MIN_STEPS_FOR_ACCURACY - 1, firstTry: 2, scoreSum: 2 };
    const report = buildStats(state, catalog, T0);
    expect(report.categories.find((c) => c.id === 'arquivos')).toMatchObject({ steps: 2, accuracy: null, firstTryRate: null });
    expect(report.overallAccuracy).toBeNull();
  });
});

describe('com dados', () => {
  function crafted(): GameState {
    const state = withCompleted(freshState(), ['f01-alfa']);
    const s = state.progress.stats;
    s.missionsStarted = 4;
    s.runsCompleted = 3;
    s.runsFailed = 1;
    s.totalTimeMs = 8 * MINUTE;
    s.categories = {
      teclado: { steps: 4, firstTry: 3, scoreSum: 3.6 },
      arquivos: { steps: 2, firstTry: 2, scoreSum: 1.6 },
      seguranca: { steps: 5, firstTry: 1, scoreSum: 2.5 },
    };
    state.progress.activeDays = [dayKey(T0 - DAY), dayKey(T0)];
    return state;
  }

  it('precisão e taxa de primeira tentativa por categoria', () => {
    const report = buildStats(crafted(), catalog, T0);
    const teclado = report.categories.find((c) => c.id === 'teclado')!;
    expect(teclado.accuracy).toBeCloseTo(0.9);
    expect(teclado.firstTryRate).toBeCloseTo(0.75);
    expect(teclado.missionsDone).toBe(1);
    expect(teclado.missionsTotal).toBe(1);
    const seguranca = report.categories.find((c) => c.id === 'seguranca')!;
    expect(seguranca.accuracy).toBeCloseTo(0.5);
    expect(seguranca.missionsDone).toBe(0);
  });

  it('precisão geral considera todas as etapas registradas', () => {
    expect(buildStats(crafted(), catalog, T0).overallAccuracy).toBeCloseTo((3.6 + 1.6 + 2.5) / 11);
  });

  it('taxa de conclusão, tempo médio, sequência', () => {
    const report = buildStats(crafted(), catalog, T0);
    expect(report.completionRate).toBeCloseTo(0.75);
    expect(report.averageRunMs).toBe(2 * MINUTE);
    expect(report.uniqueCompleted).toBe(1);
    expect(report.streak).toEqual({ current: 2, longest: 2 });
  });

  it('taxa de conclusão nunca passa de 100%', () => {
    const state = crafted();
    state.progress.stats.missionsStarted = 2;
    expect(buildStats(state, catalog, T0).completionRate).toBe(1);
  });

  it('pontos fortes (≥ 85%) e fracos (< 65%)', () => {
    const report = buildStats(crafted(), catalog, T0);
    expect(report.strengths.map((c) => c.id)).toEqual(['teclado']);
    expect(report.weaknesses.map((c) => c.id)).toEqual(['seguranca']);
  });

  it('a partir de resultados reais de missões', () => {
    const now = T0;
    let state = freshState();
    state = applyMissionResult(state, MISSION_A, playQuizMission(MISSION_A, 'r1', now), catalog, now).state;
    state = applyMissionResult(state, MISSION_C, playQuizMission(MISSION_C, 'r2', now, now + MINUTE, { reveal: [0, 1] }), catalog, now).state;
    const report = buildStats(state, catalog, now);
    expect(report.runsCompleted).toBe(1);
    expect(report.runsFailed).toBe(1);
    expect(report.uniqueCompleted).toBe(1);
    expect(report.totalAttempts).toBe(2);
    expect(report.categories.find((c) => c.id === 'teclado')).toMatchObject({ steps: 3, accuracy: 1, firstTryRate: 1, trend: [1] });
    const seg = report.categories.find((c) => c.id === 'seguranca')!;
    expect(seg.accuracy).toBeCloseTo(1 / 3, 2);
    expect(seg.trend).toHaveLength(1);
    expect(report.needsReview).toContain('senhas-fortes');
    expect(report.mastery.praticado).toContain('teclas-essenciais');
  });
});
