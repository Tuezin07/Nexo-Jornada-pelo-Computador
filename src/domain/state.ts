/**
 * Estado persistido do jogador.
 *
 * Persistido: perfil, preferências, XP total, registros por missão, evidências por
 * conceito, conquistas (com data), contadores agregados, tentativas e histórico.
 * Derivado (nunca salvo): nível, título, domínio dos conceitos, estatísticas,
 * desbloqueios e recomendações. Ver docs/ARCHITECTURE.md.
 */
import type { CategoryId, StartingLevel, StepKind } from '../content/types';

export const SCHEMA_VERSION = 1;

export const MAX_ATTEMPTS = 400;
export const MAX_HISTORY = 200;
export const MAX_PROCESSED_RUNS = 300;
export const MAX_EVIDENCE_PER_CONCEPT = 20;

export type ThemeId = 'escuro' | 'claro' | 'contraste';
export type MotionPreference = 'sistema' | 'reduzido' | 'completo';
export type PlatformPreference = 'auto' | 'windows' | 'mac';

export interface Preferences {
  soundEnabled: boolean;
  /** 0..1 */
  volume: number;
  motion: MotionPreference;
  theme: ThemeId;
  /** Escala do texto: 1, 1.15 ou 1.3. */
  fontScale: number;
  keyboardPlatform: PlatformPreference;
  /** Preferir o teclado virtual mesmo em atalhos capturáveis (telas de toque). */
  preferVirtualKeyboard: boolean;
}

export interface AssessmentRecord {
  completedAt: number;
  skipped: boolean;
  score: number;
  perCategory: Partial<Record<CategoryId, { correct: number; total: number }>>;
  questionIds: string[];
}

export interface Profile {
  nickname: string;
  startingLevel: StartingLevel | null;
  focusAreas: CategoryId[];
  wantsEverything: boolean;
  onboardingCompleted: boolean;
  tutorialSeen: boolean;
  assessment: AssessmentRecord | null;
  selectedTitle: string | null;
}

export interface MissionRecord {
  contentVersion: number;
  attempts: number;
  completions: number;
  failures: number;
  bestAccuracy: number;
  lastAccuracy: number;
  xpEarned: number;
  firstCompletedAt: number | null;
  lastCompletedAt: number | null;
  lastAttemptAt: number | null;
  lastReviewXpAt: number | null;
}

export interface ConceptEvidence {
  at: number;
  correct: boolean;
  firstTry: boolean;
  source: 'missao' | 'treino' | 'avaliacao';
}

export interface CategoryStats {
  steps: number;
  firstTry: number;
  scoreSum: number;
}

export interface AggregateStats {
  missionsStarted: number;
  runsCompleted: number;
  runsFailed: number;
  flawlessRuns: number;
  reviews: number;
  comebacks: number;
  totalTimeMs: number;
  trainingSessions: number;
  trainingAnswers: number;
  bestTypingWpm: number;
  stepKindsCorrect: Partial<Record<StepKind, number>>;
  categories: Partial<Record<CategoryId, CategoryStats>>;
}

export interface AttemptRecord {
  runId: string;
  missionId: string;
  category: CategoryId;
  at: number;
  accuracy: number;
  passed: boolean;
  durationMs: number;
  mistakes: number;
  xp: number;
  kind: 'missao' | 'treino';
}

export type HistoryType =
  | 'onboarding'
  | 'avaliacao'
  | 'missao-concluida'
  | 'missao-tentativa'
  | 'revisao'
  | 'treino'
  | 'nivel'
  | 'conquista'
  | 'setor';

export interface HistoryEntry {
  id: string;
  at: number;
  type: HistoryType;
  text: string;
  xp?: number;
}

export interface Progress {
  xp: number;
  missions: Record<string, MissionRecord>;
  concepts: Record<string, ConceptEvidence[]>;
  achievements: Record<string, number>;
  processedRuns: string[];
  trainingXpByDay: Record<string, number>;
  codexViewed: string[];
  activeDays: string[];
  stats: AggregateStats;
}

export interface GameState {
  schemaVersion: typeof SCHEMA_VERSION;
  createdAt: number;
  updatedAt: number;
  profile: Profile;
  preferences: Preferences;
  progress: Progress;
  attempts: AttemptRecord[];
  history: HistoryEntry[];
}

export function defaultPreferences(): Preferences {
  return {
    soundEnabled: true,
    volume: 0.6,
    motion: 'sistema',
    theme: 'escuro',
    fontScale: 1,
    keyboardPlatform: 'auto',
    preferVirtualKeyboard: false,
  };
}

export function emptyStats(): AggregateStats {
  return {
    missionsStarted: 0,
    runsCompleted: 0,
    runsFailed: 0,
    flawlessRuns: 0,
    reviews: 0,
    comebacks: 0,
    totalTimeMs: 0,
    trainingSessions: 0,
    trainingAnswers: 0,
    bestTypingWpm: 0,
    stepKindsCorrect: {},
    categories: {},
  };
}

export function createInitialState(now: number): GameState {
  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    profile: {
      nickname: 'Agente',
      startingLevel: null,
      focusAreas: [],
      wantsEverything: false,
      onboardingCompleted: false,
      tutorialSeen: false,
      assessment: null,
      selectedTitle: null,
    },
    preferences: defaultPreferences(),
    progress: {
      xp: 0,
      missions: {},
      concepts: {},
      achievements: {},
      processedRuns: [],
      trainingXpByDay: {},
      codexViewed: [],
      activeDays: [],
      stats: emptyStats(),
    },
    attempts: [],
    history: [],
  };
}

export function emptyMissionRecord(contentVersion: number): MissionRecord {
  return {
    contentVersion,
    attempts: 0,
    completions: 0,
    failures: 0,
    bestAccuracy: 0,
    lastAccuracy: 0,
    xpEarned: 0,
    firstCompletedAt: null,
    lastCompletedAt: null,
    lastAttemptAt: null,
    lastReviewXpAt: null,
  };
}

/** Data local no formato AAAA-MM-DD. */
export function dayKey(timestamp: number): string {
  const d = new Date(timestamp);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function isMissionCompleted(state: GameState, missionId: string): boolean {
  return (state.progress.missions[missionId]?.completions ?? 0) > 0;
}

export function completedMissionIds(state: GameState): Set<string> {
  return new Set(
    Object.entries(state.progress.missions)
      .filter(([, r]) => r.completions > 0)
      .map(([id]) => id),
  );
}
