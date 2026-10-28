/**
 * Fórmulas de XP e níveis — a ÚNICA fonte dessas regras.
 *
 * XP de missão (base = BASE_XP[dificuldade] + 5 × número de etapas):
 * - Primeira conclusão: base × (0,5 + 0,5 × precisão), + 10% da base se a precisão for 100%.
 * - Melhoria de recorde: base × 0,5 × (nova precisão − recorde anterior).
 * - Revisão: base × 0,2 × precisão, no máximo uma vez a cada REVIEW_INTERVAL_HOURS por missão.
 * - Repetição dentro do intervalo, sem novo recorde: 0 XP (a prática continua contando
 *   para o domínio dos conceitos e para as estatísticas).
 * - Missão não aprovada (precisão < 60%): 0 XP.
 *
 * Treino: TRAINING_XP_PER_ANSWER por acerto de primeira, limitado a
 * TRAINING_DAILY_CAP por dia. Avaliação inicial: ASSESSMENT_XP uma única vez.
 *
 * Níveis: passar do nível n para n+1 custa 100 + 40 × (n − 1) XP.
 */
import type { Difficulty, MissionDefinition } from '../content/types';

export const BASE_XP: Record<Difficulty, number> = { 1: 50, 2: 75, 3: 110, 4: 150 };
export const REVIEW_INTERVAL_HOURS = 20;
export const TRAINING_XP_PER_ANSWER = 3;
export const TRAINING_DAILY_CAP = 60;
export const ASSESSMENT_XP = 30;

export function missionBaseXp(mission: Pick<MissionDefinition, 'difficulty' | 'steps'>): number {
  return BASE_XP[mission.difficulty] + 5 * mission.steps.length;
}

/** XP máximo da primeira conclusão (para exibir a recompensa na Central de missões). */
export function maxFirstCompletionXp(mission: Pick<MissionDefinition, 'difficulty' | 'steps'>): number {
  const base = missionBaseXp(mission);
  return base + Math.round(base * 0.1);
}

export interface XpLine {
  label: string;
  xp: number;
}

export interface MissionXpInput {
  base: number;
  accuracy: number;
  passed: boolean;
  previousBest: number;
  completedBefore: boolean;
  lastReviewXpAt: number | null;
  lastCompletedAt: number | null;
  now: number;
}

export interface MissionXpResult {
  total: number;
  lines: XpLine[];
  isReview: boolean;
  isFirstCompletion: boolean;
}

export function computeMissionXp(input: MissionXpInput): MissionXpResult {
  const accuracy = Math.min(1, Math.max(0, input.accuracy));
  const lines: XpLine[] = [];
  if (!input.passed) return { total: 0, lines, isReview: false, isFirstCompletion: false };

  if (!input.completedBefore) {
    lines.push({ label: 'Missão concluída', xp: Math.round(input.base * (0.5 + 0.5 * accuracy)) });
    if (accuracy >= 1) lines.push({ label: 'Precisão perfeita', xp: Math.round(input.base * 0.1) });
    return { total: sum(lines), lines, isReview: false, isFirstCompletion: true };
  }

  if (accuracy > input.previousBest + 0.001) {
    lines.push({ label: 'Novo recorde de precisão', xp: Math.round(input.base * 0.5 * (accuracy - input.previousBest)) });
  }
  const reference = input.lastReviewXpAt ?? input.lastCompletedAt;
  const hours = reference === null ? Infinity : (input.now - reference) / 3_600_000;
  const isReview = hours >= REVIEW_INTERVAL_HOURS;
  if (isReview) lines.push({ label: 'Revisão espaçada', xp: Math.round(input.base * 0.2 * accuracy) });
  return { total: sum(lines.filter((l) => l.xp > 0)), lines: lines.filter((l) => l.xp > 0), isReview, isFirstCompletion: false };
}

function sum(lines: XpLine[]): number {
  return lines.reduce((total, l) => total + l.xp, 0);
}

/** Quanto falta para sair do nível `level` e chegar ao próximo. */
export function xpForNextLevel(level: number): number {
  return 100 + 40 * (level - 1);
}

/** XP total acumulado necessário para alcançar `level`. */
export function totalXpForLevel(level: number): number {
  const n = Math.max(1, Math.floor(level));
  return 100 * (n - 1) + 20 * (n - 1) * (n - 2);
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  progress: number;
  totalXp: number;
}

export function levelFromXp(xp: number): LevelInfo {
  const total = Math.max(0, Math.floor(xp));
  let level = 1;
  while (totalXpForLevel(level + 1) <= total) level++;
  const into = total - totalXpForLevel(level);
  const need = xpForNextLevel(level);
  return { level, xpIntoLevel: into, xpForNext: need, progress: into / need, totalXp: total };
}

export const RANKS: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: 'Visitante' },
  { minLevel: 2, title: 'Aprendiz' },
  { minLevel: 4, title: 'Explorador' },
  { minLevel: 6, title: 'Operador' },
  { minLevel: 8, title: 'Técnico' },
  { minLevel: 10, title: 'Especialista' },
  { minLevel: 13, title: 'Arquiteto' },
  { minLevel: 16, title: 'Root' },
];

export function rankForLevel(level: number): string {
  let title = RANKS[0]!.title;
  for (const rank of RANKS) if (level >= rank.minLevel) title = rank.title;
  return title;
}

export function trainingXp(firstTryCorrect: number, alreadyToday: number): number {
  const raw = firstTryCorrect * TRAINING_XP_PER_ANSWER;
  return Math.max(0, Math.min(raw, TRAINING_DAILY_CAP - alreadyToday));
}
