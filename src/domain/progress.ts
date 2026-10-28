/**
 * Redutores puros da progressão. Toda mudança de XP, registros, conquistas e
 * histórico passa por aqui; a interface nunca altera esses dados diretamente.
 *
 * Idempotência: cada execução de missão (runId) ou sessão de treino (sessionId) é
 * processada no máximo uma vez (`progress.processedRuns`). Reenviar o mesmo resultado
 * não concede XP de novo.
 */
import type { CategoryId, MissionDefinition, SectorId, StartingLevel } from '../content/types';
import type { ConceptId } from '../content/concepts';
import { getSector } from '../content/sectors';
import { newlyEarned, type AchievementDefinition } from './achievements';
import type { Catalog } from './catalog';
import type { RunSummary } from './engine';
import {
  MAX_ATTEMPTS,
  MAX_EVIDENCE_PER_CONCEPT,
  MAX_HISTORY,
  MAX_PROCESSED_RUNS,
  dayKey,
  emptyMissionRecord,
  type AssessmentRecord,
  type ConceptEvidence,
  type GameState,
  type HistoryEntry,
  type Preferences,
} from './state';
import { unlockedSectors } from './unlock';
import {
  ASSESSMENT_XP,
  TRAINING_DAILY_CAP,
  computeMissionXp,
  levelFromXp,
  missionBaseXp,
  rankForLevel,
  trainingXp,
  type MissionXpResult,
} from './xp';

const MAX_RUN_TIME_MS = 2 * 3_600_000;

export interface ProgressEvents {
  levelBefore: number;
  levelAfter: number;
  achievements: AchievementDefinition[];
  sectorsUnlocked: SectorId[];
}

export interface MissionReport extends ProgressEvents {
  alreadyProcessed: boolean;
  passed: boolean;
  xp: MissionXpResult;
  firstCompletion: boolean;
  comeback: boolean;
}

function historyId(now: number, suffix: string): string {
  return `${now.toString(36)}-${suffix}`;
}

function pushHistory(state: GameState, entries: HistoryEntry[]): GameState {
  if (entries.length === 0) return state;
  return { ...state, history: [...state.history, ...entries].slice(-MAX_HISTORY) };
}

function markActive(state: GameState, now: number): GameState {
  const day = dayKey(now);
  if (state.progress.activeDays.includes(day)) return state;
  return { ...state, progress: { ...state.progress, activeDays: [...state.progress.activeDays, day].slice(-400) } };
}

function addEvidence(state: GameState, items: { concept: ConceptId; evidence: ConceptEvidence }[]): GameState {
  if (items.length === 0) return state;
  const concepts = { ...state.progress.concepts };
  for (const { concept, evidence } of items) {
    concepts[concept] = [...(concepts[concept] ?? []), evidence].slice(-MAX_EVIDENCE_PER_CONCEPT);
  }
  return { ...state, progress: { ...state.progress, concepts } };
}

function addCategoryStats(state: GameState, category: CategoryId, steps: number, firstTry: number, scoreSum: number): GameState {
  const stats = state.progress.stats;
  const current = stats.categories[category] ?? { steps: 0, firstTry: 0, scoreSum: 0 };
  return {
    ...state,
    progress: {
      ...state.progress,
      stats: {
        ...stats,
        categories: {
          ...stats.categories,
          [category]: { steps: current.steps + steps, firstTry: current.firstTry + firstTry, scoreSum: current.scoreSum + scoreSum },
        },
      },
    },
  };
}

/**
 * Etapa final comum: detecta subida de nível, setores abertos e conquistas,
 * registrando cada evento no histórico.
 */
function finalize(before: GameState, after: GameState, catalog: Catalog, now: number): { state: GameState; events: ProgressEvents } {
  let state = after;
  const levelBefore = levelFromXp(before.progress.xp).level;
  const levelAfter = levelFromXp(state.progress.xp).level;
  const entries: HistoryEntry[] = [];
  if (levelAfter > levelBefore) {
    entries.push({
      id: historyId(now, `lv${levelAfter}`),
      at: now,
      type: 'nivel',
      text: `Subiu para o nível ${levelAfter} — ${rankForLevel(levelAfter)}.`,
    });
  }
  const sectorsBefore = unlockedSectors(before, catalog);
  const sectorsUnlocked = [...unlockedSectors(state, catalog)].filter((s) => !sectorsBefore.has(s));
  for (const s of sectorsUnlocked) {
    entries.push({ id: historyId(now, `sec-${s}`), at: now, type: 'setor', text: `Setor desbloqueado: ${getSector(s).name}.` });
  }
  state = pushHistory(state, entries);

  // Conquistas podem habilitar outras (ex.: nível), então avaliamos até estabilizar.
  const achievements: AchievementDefinition[] = [];
  for (let guard = 0; guard < 5; guard++) {
    const earned = newlyEarned(state, catalog, now);
    if (earned.length === 0) break;
    const unlocked = { ...state.progress.achievements };
    for (const a of earned) unlocked[a.id] = now;
    state = { ...state, progress: { ...state.progress, achievements: unlocked } };
    state = pushHistory(
      state,
      earned.map((a) => ({ id: historyId(now, `ach-${a.id}`), at: now, type: 'conquista' as const, text: `Conquista: ${a.name}.` })),
    );
    achievements.push(...earned);
  }
  return { state: { ...state, updatedAt: now }, events: { levelBefore, levelAfter, achievements, sectorsUnlocked } };
}

export function recordMissionStart(state: GameState, mission: MissionDefinition, now: number): GameState {
  const record = state.progress.missions[mission.id] ?? emptyMissionRecord(mission.version);
  const stats = state.progress.stats;
  return markActive(
    {
      ...state,
      updatedAt: now,
      progress: {
        ...state.progress,
        missions: { ...state.progress.missions, [mission.id]: { ...record, lastAttemptAt: now } },
        stats: { ...stats, missionsStarted: stats.missionsStarted + 1 },
      },
    },
    now,
  );
}

export function applyMissionResult(
  state: GameState,
  mission: MissionDefinition,
  summary: RunSummary,
  catalog: Catalog,
  now: number,
): { state: GameState; report: MissionReport } {
  const level = levelFromXp(state.progress.xp).level;
  if (state.progress.processedRuns.includes(summary.runId)) {
    return {
      state,
      report: {
        alreadyProcessed: true,
        passed: summary.passed,
        xp: { total: 0, lines: [], isReview: false, isFirstCompletion: false },
        firstCompletion: false,
        comeback: false,
        levelBefore: level,
        levelAfter: level,
        achievements: [],
        sectorsUnlocked: [],
      },
    };
  }
  if (summary.missionId !== mission.id) throw new Error('Resumo não corresponde à missão.');

  const before = state;
  const record = state.progress.missions[mission.id] ?? emptyMissionRecord(mission.version);
  const completedBefore = record.completions > 0;
  const xp = computeMissionXp({
    base: missionBaseXp(mission),
    accuracy: summary.accuracy,
    passed: summary.passed,
    previousBest: record.bestAccuracy,
    completedBefore,
    lastReviewXpAt: record.lastReviewXpAt,
    // A janela de revisão conta a partir do último XP recebido por esta missão;
    // repetições sem XP não a empurram para frente.
    lastCompletedAt: record.firstCompletedAt,
    now,
  });
  const comeback = summary.passed && !completedBefore && record.failures > 0;

  const nextRecord = {
    ...record,
    contentVersion: mission.version,
    attempts: record.attempts + 1,
    completions: record.completions + (summary.passed ? 1 : 0),
    failures: record.failures + (summary.passed ? 0 : 1),
    bestAccuracy: summary.passed ? Math.max(record.bestAccuracy, summary.accuracy) : record.bestAccuracy,
    lastAccuracy: summary.accuracy,
    xpEarned: record.xpEarned + xp.total,
    firstCompletedAt: record.firstCompletedAt ?? (summary.passed ? now : null),
    lastCompletedAt: summary.passed ? now : record.lastCompletedAt,
    lastAttemptAt: now,
    lastReviewXpAt: xp.isReview ? now : record.lastReviewXpAt,
  };

  const stats = state.progress.stats;
  const stepKindsCorrect = { ...stats.stepKindsCorrect };
  for (const s of summary.stepKinds) if (s.correct) stepKindsCorrect[s.kind] = (stepKindsCorrect[s.kind] ?? 0) + 1;
  const typingCounts = Boolean(summary.passed && summary.typing && summary.typing.accuracy >= 0.92);

  let next: GameState = {
    ...state,
    progress: {
      ...state.progress,
      xp: state.progress.xp + xp.total,
      missions: { ...state.progress.missions, [mission.id]: nextRecord },
      processedRuns: [...state.progress.processedRuns, summary.runId].slice(-MAX_PROCESSED_RUNS),
      stats: {
        ...stats,
        runsCompleted: stats.runsCompleted + (summary.passed ? 1 : 0),
        runsFailed: stats.runsFailed + (summary.passed ? 0 : 1),
        flawlessRuns: stats.flawlessRuns + (summary.passed && summary.flawless ? 1 : 0),
        reviews: stats.reviews + (xp.isReview ? 1 : 0),
        comebacks: stats.comebacks + (comeback ? 1 : 0),
        totalTimeMs: stats.totalTimeMs + Math.min(summary.durationMs, MAX_RUN_TIME_MS),
        bestTypingWpm: typingCounts ? Math.max(stats.bestTypingWpm, summary.typing!.wpm) : stats.bestTypingWpm,
        stepKindsCorrect,
      },
    },
    attempts: [
      ...state.attempts,
      {
        runId: summary.runId,
        missionId: mission.id,
        category: mission.category,
        at: now,
        accuracy: summary.accuracy,
        passed: summary.passed,
        durationMs: summary.durationMs,
        mistakes: summary.mistakes,
        xp: xp.total,
        kind: 'missao' as const,
      },
    ].slice(-MAX_ATTEMPTS),
  };
  next = addCategoryStats(next, mission.category, summary.totalSteps, summary.firstTrySteps, summary.accuracy * summary.totalSteps);
  next = addEvidence(
    next,
    summary.conceptResults.map((r) => ({
      concept: r.concept,
      evidence: { at: now, correct: r.correct, firstTry: r.firstTry, source: 'missao' as const },
    })),
  );
  next = markActive(next, now);

  const pct = Math.round(summary.accuracy * 100);
  const text = !summary.passed
    ? `Tentativa em “${mission.title}” (${pct}% de precisão).`
    : !completedBefore
      ? `Missão concluída: “${mission.title}” (${pct}%).`
      : xp.isReview
        ? `Revisão de “${mission.title}” (${pct}%).`
        : `Missão repetida: “${mission.title}” (${pct}%).`;
  next = pushHistory(next, [
    {
      id: historyId(now, summary.runId.slice(0, 8)),
      at: now,
      type: !summary.passed ? 'missao-tentativa' : xp.isReview ? 'revisao' : 'missao-concluida',
      text,
      ...(xp.total > 0 ? { xp: xp.total } : {}),
    },
  ]);

  const { state: finalState, events } = finalize(before, next, catalog, now);
  return {
    state: finalState,
    report: { alreadyProcessed: false, passed: summary.passed, xp, firstCompletion: xp.isFirstCompletion, comeback, ...events },
  };
}

export interface TrainingAnswer {
  concept: ConceptId;
  category: CategoryId;
  correct: boolean;
  firstTry: boolean;
}

export interface TrainingSummary {
  sessionId: string;
  mode: string;
  label: string;
  category: CategoryId | null;
  answers: TrainingAnswer[];
  durationMs: number;
  typingWpm?: number;
  typingAccuracy?: number;
}

export interface TrainingReport extends ProgressEvents {
  alreadyProcessed: boolean;
  xp: number;
  capReached: boolean;
}

export function applyTrainingResult(
  state: GameState,
  summary: TrainingSummary,
  catalog: Catalog,
  now: number,
): { state: GameState; report: TrainingReport } {
  const level = levelFromXp(state.progress.xp).level;
  if (state.progress.processedRuns.includes(summary.sessionId) || summary.answers.length === 0) {
    return {
      state,
      report: { alreadyProcessed: true, xp: 0, capReached: false, levelBefore: level, levelAfter: level, achievements: [], sectorsUnlocked: [] },
    };
  }
  const before = state;
  const day = dayKey(now);
  const today = state.progress.trainingXpByDay[day] ?? 0;
  const firstTryCorrect = summary.answers.filter((a) => a.correct && a.firstTry).length;
  const xp = trainingXp(firstTryCorrect, today);
  const stats = state.progress.stats;
  const correct = summary.answers.filter((a) => a.correct).length;
  const accuracy = correct / summary.answers.length;
  // Mantém apenas os últimos 30 dias de controle do limite diário.
  const recentDays = Object.entries(state.progress.trainingXpByDay).filter(([d]) => d >= dayKey(now - 30 * 86_400_000));

  let next: GameState = {
    ...state,
    progress: {
      ...state.progress,
      xp: state.progress.xp + xp,
      processedRuns: [...state.progress.processedRuns, summary.sessionId].slice(-MAX_PROCESSED_RUNS),
      trainingXpByDay: { ...Object.fromEntries(recentDays), [day]: today + xp },
      stats: {
        ...stats,
        trainingSessions: stats.trainingSessions + 1,
        trainingAnswers: stats.trainingAnswers + summary.answers.length,
        totalTimeMs: stats.totalTimeMs + Math.min(summary.durationMs, MAX_RUN_TIME_MS),
        bestTypingWpm:
          summary.typingWpm !== undefined && (summary.typingAccuracy ?? 0) >= 0.92
            ? Math.max(stats.bestTypingWpm, summary.typingWpm)
            : stats.bestTypingWpm,
      },
    },
    attempts: [
      ...state.attempts,
      {
        runId: summary.sessionId,
        missionId: `treino:${summary.mode}`,
        category: summary.category ?? summary.answers[0]!.category,
        at: now,
        accuracy,
        passed: accuracy >= 0.6,
        durationMs: summary.durationMs,
        mistakes: summary.answers.length - correct,
        xp,
        kind: 'treino' as const,
      },
    ].slice(-MAX_ATTEMPTS),
  };
  const byCategory = new Map<CategoryId, TrainingAnswer[]>();
  for (const a of summary.answers) byCategory.set(a.category, [...(byCategory.get(a.category) ?? []), a]);
  for (const [category, answers] of byCategory) {
    next = addCategoryStats(
      next,
      category,
      answers.length,
      answers.filter((a) => a.firstTry && a.correct).length,
      answers.filter((a) => a.correct).length,
    );
  }
  next = addEvidence(
    next,
    summary.answers.map((a) => ({ concept: a.concept, evidence: { at: now, correct: a.correct, firstTry: a.firstTry, source: 'treino' as const } })),
  );
  next = markActive(next, now);
  next = pushHistory(next, [
    {
      id: historyId(now, summary.sessionId.slice(0, 8)),
      at: now,
      type: 'treino',
      text: `Treino: ${summary.label} — ${correct} de ${summary.answers.length} acertos.`,
      ...(xp > 0 ? { xp } : {}),
    },
  ]);
  const { state: finalState, events } = finalize(before, next, catalog, now);
  return { state: finalState, report: { alreadyProcessed: false, xp, capReached: today + xp >= TRAINING_DAILY_CAP, ...events } };
}

export interface OnboardingChoices {
  startingLevel: StartingLevel;
  focusAreas: CategoryId[];
  wantsEverything: boolean;
}

export function applyOnboarding(state: GameState, choices: OnboardingChoices, catalog: Catalog, now: number): GameState {
  const first = !state.history.some((h) => h.type === 'onboarding');
  let next: GameState = {
    ...state,
    profile: {
      ...state.profile,
      startingLevel: choices.startingLevel,
      focusAreas: [...new Set(choices.focusAreas)],
      wantsEverything: choices.wantsEverything,
      onboardingCompleted: true,
    },
  };
  if (first) {
    next = pushHistory(next, [{ id: historyId(now, 'onb'), at: now, type: 'onboarding', text: 'Configuração inicial concluída.' }]);
  }
  next = markActive(next, now);
  return finalize(state, next, catalog, now).state;
}

export function applyAssessment(
  state: GameState,
  record: AssessmentRecord,
  evidence: { concept: ConceptId; correct: boolean }[],
  catalog: Catalog,
  now: number,
): { state: GameState; events: ProgressEvents; xp: number } {
  const alreadyRewarded = state.history.some((h) => h.type === 'avaliacao' && (h.xp ?? 0) > 0);
  const xp = record.skipped || alreadyRewarded ? 0 : ASSESSMENT_XP;
  let next: GameState = {
    ...state,
    profile: { ...state.profile, assessment: record },
    progress: { ...state.progress, xp: state.progress.xp + xp },
  };
  if (!record.skipped) {
    next = addEvidence(
      next,
      evidence.map((e) => ({ concept: e.concept, evidence: { at: now, correct: e.correct, firstTry: true, source: 'avaliacao' as const } })),
    );
  }
  next = pushHistory(next, [
    {
      id: historyId(now, 'aval'),
      at: now,
      type: 'avaliacao',
      text: record.skipped ? 'Avaliação inicial pulada.' : `Avaliação inicial: ${Math.round(record.score * 100)}%.`,
      ...(xp > 0 ? { xp } : {}),
    },
  ]);
  next = markActive(next, now);
  const { state: finalState, events } = finalize(state, next, catalog, now);
  return { state: finalState, events, xp };
}

export function markCodexViewed(state: GameState, concept: ConceptId, catalog: Catalog, now: number): { state: GameState; events: ProgressEvents } {
  if (state.progress.codexViewed.includes(concept)) {
    const level = levelFromXp(state.progress.xp).level;
    return { state, events: { levelBefore: level, levelAfter: level, achievements: [], sectorsUnlocked: [] } };
  }
  const next = { ...state, progress: { ...state.progress, codexViewed: [...state.progress.codexViewed, concept] } };
  return finalize(state, next, catalog, now);
}

export function updatePreferences(state: GameState, patch: Partial<Preferences>, now: number): GameState {
  return { ...state, updatedAt: now, preferences: { ...state.preferences, ...patch } };
}

export function updateProfile(
  state: GameState,
  patch: Partial<Pick<GameState['profile'], 'nickname' | 'selectedTitle' | 'tutorialSeen'>>,
  now: number,
): GameState {
  return { ...state, updatedAt: now, profile: { ...state.profile, ...patch } };
}

/** Recomeça o tutorial e a configuração inicial sem apagar o progresso. */
export function restartTutorial(state: GameState, now: number): GameState {
  return { ...state, updatedAt: now, profile: { ...state.profile, onboardingCompleted: false, tutorialSeen: false } };
}
