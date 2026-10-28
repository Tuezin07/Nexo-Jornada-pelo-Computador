/**
 * Validação e reparo do estado carregado (do IndexedDB ou de um backup).
 *
 * Estratégia: partir de um estado padrão e copiar apenas campos válidos. Campos
 * inválidos são descartados e registrados em `issues`; nunca lançamos exceção por
 * dados ruins, para não perder o restante do progresso.
 */
import type { CategoryId, StartingLevel, StepKind } from '../content/types';
import { CATEGORY_IDS } from '../content/categories';
import { isConceptId } from '../content/concepts';
import { getAchievement } from '../domain/achievements';
import {
  MAX_ATTEMPTS,
  MAX_EVIDENCE_PER_CONCEPT,
  MAX_HISTORY,
  MAX_PROCESSED_RUNS,
  createInitialState,
  emptyMissionRecord,
  type AttemptRecord,
  type CategoryStats,
  type ConceptEvidence,
  type GameState,
  type HistoryEntry,
  type HistoryType,
  type MissionRecord,
} from '../domain/state';

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const num = (v: unknown, fallback: number, min = -Infinity, max = Infinity) =>
  isFiniteNumber(v) ? Math.min(max, Math.max(min, v)) : fallback;
const int = (v: unknown, fallback = 0, max = 1e9) => Math.floor(num(v, fallback, 0, max));
const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
const str = (v: unknown, fallback: string, maxLength = 200) => (typeof v === 'string' ? v.slice(0, maxLength) : fallback);
const nullableTime = (v: unknown) => (isFiniteNumber(v) && v > 0 ? v : null);
const oneOf = <T extends string>(v: unknown, options: readonly T[], fallback: T): T =>
  typeof v === 'string' && (options as readonly string[]).includes(v) ? (v as T) : fallback;

const LEVELS: readonly StartingLevel[] = ['iniciante', 'casual', 'veterano', 'mestre'];
const STEP_KINDS: readonly StepKind[] = ['quiz', 'order', 'classify', 'shortcut', 'typing', 'filesystem', 'terminal', 'settings', 'diagnosis', 'inspect'];
const HISTORY_TYPES: readonly HistoryType[] = ['onboarding', 'avaliacao', 'missao-concluida', 'missao-tentativa', 'revisao', 'treino', 'nivel', 'conquista', 'setor'];
const isCategory = (v: unknown): v is CategoryId => typeof v === 'string' && (CATEGORY_IDS as string[]).includes(v);

export interface SanitizeResult {
  state: GameState;
  issues: string[];
}

export function sanitizeState(raw: unknown, now: number): SanitizeResult {
  const issues: string[] = [];
  const state = createInitialState(now);
  if (!isObj(raw)) {
    issues.push('Dados ausentes ou em formato inesperado; um novo perfil foi criado.');
    return { state, issues };
  }

  state.createdAt = num(raw.createdAt, now, 0, now + 86_400_000);
  state.updatedAt = num(raw.updatedAt, now, 0, now + 86_400_000);

  // Perfil
  const p = isObj(raw.profile) ? raw.profile : {};
  if (!isObj(raw.profile)) issues.push('Perfil inválido; preferências iniciais restauradas.');
  state.profile.nickname = str(p.nickname, 'Agente', 24).trim() || 'Agente';
  state.profile.startingLevel = p.startingLevel === null ? null : oneOf(p.startingLevel, LEVELS, 'iniciante');
  if (p.startingLevel === undefined) state.profile.startingLevel = null;
  state.profile.focusAreas = Array.isArray(p.focusAreas) ? [...new Set(p.focusAreas.filter(isCategory))] : [];
  state.profile.wantsEverything = bool(p.wantsEverything, false);
  state.profile.onboardingCompleted = bool(p.onboardingCompleted, false) && state.profile.startingLevel !== null;
  state.profile.tutorialSeen = bool(p.tutorialSeen, false);
  state.profile.selectedTitle = typeof p.selectedTitle === 'string' ? p.selectedTitle.slice(0, 40) : null;
  if (isObj(p.assessment)) {
    const a = p.assessment;
    const perCategory: NonNullable<GameState['profile']['assessment']>['perCategory'] = {};
    if (isObj(a.perCategory)) {
      for (const [k, v] of Object.entries(a.perCategory)) {
        if (isCategory(k) && isObj(v)) {
          const total = int(v.total, 0, 50);
          perCategory[k] = { total, correct: Math.min(total, int(v.correct, 0, 50)) };
        }
      }
    }
    state.profile.assessment = {
      completedAt: num(a.completedAt, now, 0),
      skipped: bool(a.skipped, true),
      score: num(a.score, 0, 0, 1),
      perCategory,
      questionIds: Array.isArray(a.questionIds) ? a.questionIds.filter((q): q is string => typeof q === 'string').slice(0, 30) : [],
    };
  }

  // Preferências
  const pr = isObj(raw.preferences) ? raw.preferences : {};
  const d = state.preferences;
  state.preferences = {
    soundEnabled: bool(pr.soundEnabled, d.soundEnabled),
    volume: num(pr.volume, d.volume, 0, 1),
    motion: oneOf(pr.motion, ['sistema', 'reduzido', 'completo'] as const, d.motion),
    theme: oneOf(pr.theme, ['escuro', 'claro', 'contraste'] as const, d.theme),
    fontScale: [1, 1.15, 1.3].includes(pr.fontScale as number) ? (pr.fontScale as number) : d.fontScale,
    keyboardPlatform: oneOf(pr.keyboardPlatform, ['auto', 'windows', 'mac'] as const, d.keyboardPlatform),
    preferVirtualKeyboard: bool(pr.preferVirtualKeyboard, d.preferVirtualKeyboard),
  };

  // Progresso
  const g = isObj(raw.progress) ? raw.progress : {};
  if (!isObj(raw.progress)) issues.push('Progresso ilegível; foi reiniciado.');
  state.progress.xp = int(g.xp, 0, 10_000_000);

  if (isObj(g.missions)) {
    for (const [id, value] of Object.entries(g.missions)) {
      if (!/^[a-z0-9-]{1,60}$/.test(id) || !isObj(value)) {
        issues.push(`Registro de missão inválido descartado (${id.slice(0, 30)}).`);
        continue;
      }
      const base = emptyMissionRecord(int(value.contentVersion, 1, 1000) || 1);
      const record: MissionRecord = {
        ...base,
        attempts: int(value.attempts),
        completions: int(value.completions),
        failures: int(value.failures),
        bestAccuracy: num(value.bestAccuracy, 0, 0, 1),
        lastAccuracy: num(value.lastAccuracy, 0, 0, 1),
        xpEarned: int(value.xpEarned),
        firstCompletedAt: nullableTime(value.firstCompletedAt),
        lastCompletedAt: nullableTime(value.lastCompletedAt),
        lastAttemptAt: nullableTime(value.lastAttemptAt),
        lastReviewXpAt: nullableTime(value.lastReviewXpAt),
      };
      if (record.completions > 0 && record.firstCompletedAt === null) record.firstCompletedAt = record.lastCompletedAt ?? now;
      state.progress.missions[id] = record;
    }
  }

  if (isObj(g.concepts)) {
    for (const [id, list] of Object.entries(g.concepts)) {
      if (!isConceptId(id) || !Array.isArray(list)) continue;
      const evidence: ConceptEvidence[] = list
        .filter(isObj)
        .filter((e) => isFiniteNumber(e.at))
        .map((e) => ({
          at: e.at as number,
          correct: bool(e.correct, false),
          firstTry: bool(e.firstTry, false),
          source: oneOf(e.source, ['missao', 'treino', 'avaliacao'] as const, 'missao'),
        }))
        .slice(-MAX_EVIDENCE_PER_CONCEPT);
      if (evidence.length > 0) state.progress.concepts[id] = evidence;
    }
  }

  if (isObj(g.achievements)) {
    for (const [id, at] of Object.entries(g.achievements)) {
      if (getAchievement(id) && isFiniteNumber(at)) state.progress.achievements[id] = at;
    }
  }

  state.progress.processedRuns = Array.isArray(g.processedRuns)
    ? g.processedRuns.filter((r): r is string => typeof r === 'string').slice(-MAX_PROCESSED_RUNS)
    : [];
  if (isObj(g.trainingXpByDay)) {
    for (const [day, xp] of Object.entries(g.trainingXpByDay)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day)) state.progress.trainingXpByDay[day] = int(xp, 0, 1000);
    }
  }
  state.progress.codexViewed = Array.isArray(g.codexViewed) ? [...new Set(g.codexViewed.filter((c): c is string => typeof c === 'string' && isConceptId(c)))] : [];
  state.progress.activeDays = Array.isArray(g.activeDays)
    ? [...new Set(g.activeDays.filter((day): day is string => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day)))].slice(-400)
    : [];

  const s = isObj(g.stats) ? g.stats : {};
  const st = state.progress.stats;
  st.missionsStarted = int(s.missionsStarted);
  st.runsCompleted = int(s.runsCompleted);
  st.runsFailed = int(s.runsFailed);
  st.flawlessRuns = int(s.flawlessRuns);
  st.reviews = int(s.reviews);
  st.comebacks = int(s.comebacks);
  st.totalTimeMs = int(s.totalTimeMs, 0, 1e12);
  st.trainingSessions = int(s.trainingSessions);
  st.trainingAnswers = int(s.trainingAnswers);
  st.bestTypingWpm = int(s.bestTypingWpm, 0, 250);
  if (isObj(s.stepKindsCorrect)) {
    for (const k of STEP_KINDS) if (s.stepKindsCorrect[k] !== undefined) st.stepKindsCorrect[k] = int(s.stepKindsCorrect[k]);
  }
  if (isObj(s.categories)) {
    for (const [k, v] of Object.entries(s.categories)) {
      if (!isCategory(k) || !isObj(v)) continue;
      const steps = int(v.steps);
      const cs: CategoryStats = { steps, firstTry: Math.min(steps, int(v.firstTry)), scoreSum: num(v.scoreSum, 0, 0, steps) };
      st.categories[k] = cs;
    }
  }
  st.missionsStarted = Math.max(st.missionsStarted, st.runsCompleted);

  // Tentativas e histórico
  if (Array.isArray(raw.attempts)) {
    state.attempts = raw.attempts
      .filter(isObj)
      .filter((a) => typeof a.runId === 'string' && typeof a.missionId === 'string' && isCategory(a.category) && isFiniteNumber(a.at))
      .map(
        (a): AttemptRecord => ({
          runId: (a.runId as string).slice(0, 80),
          missionId: (a.missionId as string).slice(0, 80),
          category: a.category as CategoryId,
          at: a.at as number,
          accuracy: num(a.accuracy, 0, 0, 1),
          passed: bool(a.passed, false),
          durationMs: int(a.durationMs, 0, 1e9),
          mistakes: int(a.mistakes, 0, 10_000),
          xp: int(a.xp, 0, 10_000),
          kind: oneOf(a.kind, ['missao', 'treino'] as const, 'missao'),
        }),
      )
      .slice(-MAX_ATTEMPTS);
  }
  if (Array.isArray(raw.history)) {
    state.history = raw.history
      .filter(isObj)
      .filter((h) => typeof h.id === 'string' && isFiniteNumber(h.at) && typeof h.text === 'string')
      .map(
        (h): HistoryEntry => ({
          id: (h.id as string).slice(0, 80),
          at: h.at as number,
          type: oneOf(h.type, HISTORY_TYPES, 'missao-concluida'),
          text: (h.text as string).slice(0, 300),
          ...(isFiniteNumber(h.xp) ? { xp: int(h.xp, 0, 10_000) } : {}),
        }),
      )
      .slice(-MAX_HISTORY);
  }

  return { state, issues };
}
