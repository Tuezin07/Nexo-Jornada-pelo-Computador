import { describe, expect, it } from 'vitest';
import {
  applyAssessment,
  applyMissionResult,
  applyOnboarding,
  applyTrainingResult,
  markCodexViewed,
  recordMissionStart,
  type TrainingSummary,
} from '../../src/domain/progress';
import { scoreAssessment } from '../../src/domain/assessment';
import { MAX_PROCESSED_RUNS, dayKey, type GameState } from '../../src/domain/state';
import { missionStatus } from '../../src/domain/unlock';
import { ASSESSMENT_XP, TRAINING_DAILY_CAP, missionBaseXp } from '../../src/domain/xp';
import {
  HOUR,
  MINUTE,
  MISSION_A,
  MISSION_B,
  MISSION_C,
  T0,
  freshState,
  makeQuestion,
  playQuizMission,
  syntheticCatalog,
} from '../helpers/fixtures';

const catalog = syntheticCatalog();
const BASE_A = missionBaseXp(MISSION_A); // 50 + 3 × 5 = 65
const PERFECT_A = BASE_A + Math.round(BASE_A * 0.1); // 72

function complete(state: GameState, runId: string, at: number, mission = MISSION_A, options = {}) {
  const summary = playQuizMission(mission, runId, at - 5 * MINUTE, at, options);
  return { summary, ...applyMissionResult(state, mission, summary, catalog, at) };
}

describe('applyMissionResult', () => {
  it('concede XP da primeira conclusão uma única vez', () => {
    const { state, report } = complete(freshState(), 'run-1', T0);
    expect(BASE_A).toBe(65);
    expect(report.alreadyProcessed).toBe(false);
    expect(report.passed).toBe(true);
    expect(report.firstCompletion).toBe(true);
    expect(report.xp.total).toBe(PERFECT_A);
    expect(state.progress.xp).toBe(PERFECT_A);
    expect(state.progress.missions['f01-alfa']).toMatchObject({
      attempts: 1,
      completions: 1,
      failures: 0,
      bestAccuracy: 1,
      lastAccuracy: 1,
      xpEarned: PERFECT_A,
      firstCompletedAt: T0,
      lastCompletedAt: T0,
      lastAttemptAt: T0,
      lastReviewXpAt: null,
    });
    expect(state.progress.processedRuns).toEqual(['run-1']);
    expect(state.updatedAt).toBe(T0);
  });

  it('o mesmo runId reenviado é ignorado (sem XP duplicado)', () => {
    const first = complete(freshState(), 'run-1', T0);
    const again = applyMissionResult(first.state, MISSION_A, first.summary, catalog, T0 + MINUTE);
    expect(again.report.alreadyProcessed).toBe(true);
    expect(again.report.xp.total).toBe(0);
    expect(again.report.achievements).toEqual([]);
    expect(again.state).toBe(first.state);
    expect(again.state.progress.xp).toBe(PERFECT_A);
    expect(again.state.attempts).toHaveLength(1);
  });

  it('segunda execução da mesma missão logo depois não dá XP, mas é registrada', () => {
    const first = complete(freshState(), 'run-1', T0);
    const second = complete(first.state, 'run-2', T0 + 10 * MINUTE);
    expect(second.report.alreadyProcessed).toBe(false);
    expect(second.report.xp.total).toBe(0);
    expect(second.report.firstCompletion).toBe(false);
    expect(second.state.progress.xp).toBe(PERFECT_A);
    expect(second.state.progress.missions['f01-alfa']).toMatchObject({ attempts: 2, completions: 2, xpEarned: PERFECT_A, firstCompletedAt: T0 });
    expect(second.state.attempts.map((a) => a.xp)).toEqual([PERFECT_A, 0]);
    expect(second.state.history.at(-1)).toMatchObject({ type: 'missao-concluida', text: 'Missão repetida: “Missão f01-alfa” (100%).' });
    expect(second.state.history.at(-1)!.xp).toBeUndefined();
    // a prática conta para o domínio
    expect(second.state.progress.concepts['teclas-essenciais']).toHaveLength(6);
  });

  it('revisão espaçada depois de 20 h dá XP de revisão e a conquista "memoria-longa"', () => {
    const first = complete(freshState(), 'run-1', T0);
    const review = complete(first.state, 'run-2', T0 + 21 * HOUR);
    expect(review.report.xp.isReview).toBe(true);
    expect(review.report.xp.total).toBe(Math.round(BASE_A * 0.2));
    expect(review.state.progress.missions['f01-alfa']!.lastReviewXpAt).toBe(T0 + 21 * HOUR);
    expect(review.state.progress.stats.reviews).toBe(1);
    expect(review.report.achievements.map((a) => a.id)).toContain('memoria-longa');
    expect(review.state.history.some((h) => h.type === 'revisao')).toBe(true);
    // outra repetição logo depois da revisão não rende de novo
    const again = complete(review.state, 'run-3', T0 + 22 * HOUR);
    expect(again.report.xp.total).toBe(0);
  });

  it('melhoria de recorde rende a diferença', () => {
    const first = complete(freshState(), 'run-1', T0, MISSION_A, { wrongFirst: [0, 1, 2] }); // 0,8
    expect(first.state.progress.missions['f01-alfa']!.bestAccuracy).toBe(0.8);
    const better = complete(first.state, 'run-2', T0 + HOUR);
    // base × 0,5 × (1 − 0,8) = 6,5 (com o arredondamento de ponto flutuante, 6 ou 7)
    expect(better.report.xp.total).toBe(Math.round(BASE_A * 0.5 * (1 - 0.8)));
    expect(better.report.xp.isReview).toBe(false);
    expect(better.state.progress.missions['f01-alfa']!.bestAccuracy).toBe(1);
  });

  it('desbloqueia a missão dependente ao concluir o pré-requisito', () => {
    const start = freshState();
    expect(missionStatus(MISSION_B, start, catalog)).toBe('bloqueada-requisito');
    const { state } = complete(start, 'run-1', T0);
    expect(missionStatus(MISSION_A, state, catalog)).toBe('concluida');
    expect(missionStatus(MISSION_B, state, catalog)).toBe('disponivel');
  });

  it('concede "primeiro-passo" e registra no histórico', () => {
    const { state, report } = complete(freshState(), 'run-1', T0);
    expect(report.achievements.map((a) => a.id)).toEqual(['primeiro-passo', 'sem-arranhoes']);
    expect(state.progress.achievements).toEqual({ 'primeiro-passo': T0, 'sem-arranhoes': T0 });
    expect(state.history.filter((h) => h.type === 'conquista').map((h) => h.text)).toEqual(['Conquista: Primeiro passo.', 'Conquista: Sem arranhões.']);
    // não é concedida de novo
    const second = complete(state, 'run-2', T0 + MINUTE);
    expect(second.report.achievements).toEqual([]);
    expect(second.state.progress.achievements['primeiro-passo']).toBe(T0);
  });

  it('registra tentativa, histórico, evidências e estatísticas por categoria', () => {
    const { state } = complete(freshState(), 'run-1', T0, MISSION_A, { wrongFirst: [1] });
    expect(state.attempts).toEqual([
      {
        runId: 'run-1',
        missionId: 'f01-alfa',
        category: 'teclado',
        at: T0,
        accuracy: 0.933,
        passed: true,
        durationMs: 5 * MINUTE,
        mistakes: 1,
        xp: Math.round(BASE_A * (0.5 + 0.5 * 0.933)),
        kind: 'missao',
      },
    ]);
    const done = state.history.find((h) => h.type === 'missao-concluida')!;
    expect(done).toMatchObject({ at: T0, text: 'Missão concluída: “Missão f01-alfa” (93%).', xp: state.attempts[0]!.xp });
    expect(state.progress.concepts['teclas-essenciais']).toEqual([
      { at: T0, correct: true, firstTry: true, source: 'missao' },
      { at: T0, correct: true, firstTry: false, source: 'missao' },
      { at: T0, correct: true, firstTry: true, source: 'missao' },
    ]);
    expect(state.progress.stats.categories.teclado).toEqual({ steps: 3, firstTry: 2, scoreSum: expect.closeTo(2.8, 2) });
    expect(state.progress.stats).toMatchObject({ runsCompleted: 1, runsFailed: 0, flawlessRuns: 0, totalTimeMs: 5 * MINUTE, stepKindsCorrect: { quiz: 3 } });
    expect(state.progress.activeDays).toEqual([dayKey(T0)]);
  });

  it('missão reprovada: sem XP, conta falha; depois, aprovação conta como superação', () => {
    const failed = complete(freshState(), 'run-1', T0, MISSION_C, { reveal: [0, 1] });
    expect(failed.report.passed).toBe(false);
    expect(failed.report.xp.total).toBe(0);
    expect(failed.state.progress.xp).toBe(0);
    expect(failed.state.progress.missions['f03-gama']).toMatchObject({ attempts: 1, completions: 0, failures: 1, bestAccuracy: 0, firstCompletedAt: null });
    expect(failed.state.history.at(-1)).toMatchObject({ type: 'missao-tentativa' });
    expect(failed.state.progress.stats.runsFailed).toBe(1);
    expect(failed.report.achievements).toEqual([]);

    const passed = complete(failed.state, 'run-2', T0 + HOUR, MISSION_C);
    expect(passed.report.comeback).toBe(true);
    expect(passed.report.firstCompletion).toBe(true);
    expect(passed.report.achievements.map((a) => a.id)).toContain('persistencia');
  });

  it('subida de nível e setor desbloqueado entram no histórico', () => {
    const start: GameState = { ...freshState(), progress: { ...freshState().progress, xp: 90 } };
    const first = complete(start, 'run-1', T0);
    expect(first.report.levelBefore).toBe(1);
    expect(first.report.levelAfter).toBe(2);
    expect(first.state.history.some((h) => h.type === 'nivel' && h.text.includes('nível 2'))).toBe(true);

    const second = complete(first.state, 'run-2', T0 + HOUR, MISSION_C);
    expect(second.report.sectorsUnlocked).toEqual(['sistema']);
    expect(second.state.history.some((h) => h.type === 'setor' && h.text === 'Setor desbloqueado: Domínio do sistema.')).toBe(true);
  });

  it('resumo de outra missão é recusado', () => {
    const summary = playQuizMission(MISSION_A, 'run-x', T0);
    expect(() => applyMissionResult(freshState(), MISSION_B, summary, catalog, T0)).toThrow();
  });

  it('lista de execuções processadas tem tamanho limitado', () => {
    let state = freshState();
    state = { ...state, progress: { ...state.progress, processedRuns: Array.from({ length: MAX_PROCESSED_RUNS }, (_, i) => `old-${i}`) } };
    state = complete(state, 'novo', T0).state;
    expect(state.progress.processedRuns).toHaveLength(MAX_PROCESSED_RUNS);
    expect(state.progress.processedRuns.at(-1)).toBe('novo');
  });

  it('início de missão conta tentativa iniciada e dia ativo', () => {
    const state = recordMissionStart(freshState(), MISSION_A, T0);
    expect(state.progress.stats.missionsStarted).toBe(1);
    expect(state.progress.missions['f01-alfa']).toMatchObject({ lastAttemptAt: T0, completions: 0 });
    expect(state.progress.activeDays).toEqual([dayKey(T0)]);
  });
});

describe('treino, onboarding, avaliação e Codex', () => {
  const session = (id: string, correct: number): TrainingSummary => ({
    sessionId: id,
    mode: 'atalhos',
    label: 'Atalhos',
    category: 'teclado',
    answers: Array.from({ length: correct }, () => ({ concept: 'teclas-essenciais' as const, category: 'teclado' as const, correct: true, firstTry: true })),
    durationMs: MINUTE,
  });

  it('treino: XP com limite diário e sessão idempotente', () => {
    const one = applyTrainingResult(freshState(), session('s1', 15), catalog, T0);
    expect(one.report.xp).toBe(45);
    const two = applyTrainingResult(one.state, session('s2', 15), catalog, T0 + HOUR);
    expect(two.report.xp).toBe(TRAINING_DAILY_CAP - 45);
    expect(two.report.capReached).toBe(true);
    expect(two.state.progress.trainingXpByDay[dayKey(T0)]).toBe(TRAINING_DAILY_CAP);
    const repeated = applyTrainingResult(two.state, session('s2', 15), catalog, T0 + HOUR);
    expect(repeated.report.alreadyProcessed).toBe(true);
    expect(repeated.state).toBe(two.state);
  });

  it('onboarding abre setores pelo nível declarado e registra uma vez', () => {
    const once = applyOnboarding(freshState(), { startingLevel: 'casual', focusAreas: ['redes', 'redes'], wantsEverything: false }, catalog, T0);
    expect(once.profile).toMatchObject({ startingLevel: 'casual', focusAreas: ['redes'], onboardingCompleted: true });
    expect(once.history.filter((h) => h.type === 'setor').map((h) => h.text)).toEqual(['Setor desbloqueado: Domínio do sistema.']);
    const twice = applyOnboarding(once, { startingLevel: 'casual', focusAreas: [], wantsEverything: true }, catalog, T0 + 1);
    expect(twice.history.filter((h) => h.type === 'onboarding')).toHaveLength(1);
  });

  it('avaliação dá XP uma única vez e a conquista "calibrado"', () => {
    const q = [makeQuestion('q1', 'teclado', 1), makeQuestion('q2', 'redes', 2)];
    const record = scoreAssessment(q, { q1: 'a', q2: 'a' }, T0);
    const first = applyAssessment(freshState(), record, [{ concept: 'teclas-essenciais', correct: true }], catalog, T0);
    expect(first.xp).toBe(ASSESSMENT_XP);
    expect(first.events.achievements.map((a) => a.id)).toContain('calibrado');
    expect(first.state.progress.concepts['teclas-essenciais']).toHaveLength(1);
    const again = applyAssessment(first.state, record, [], catalog, T0 + 1);
    expect(again.xp).toBe(0);
    expect(again.state.progress.xp).toBe(ASSESSMENT_XP);
  });

  it('Codex visto conta uma vez', () => {
    const first = markCodexViewed(freshState(), 'phishing', catalog, T0);
    const second = markCodexViewed(first.state, 'phishing', catalog, T0);
    expect(second.state).toBe(first.state);
    expect(second.state.progress.codexViewed).toEqual(['phishing']);
  });
});
