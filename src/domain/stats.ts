/**
 * Estatísticas derivadas exclusivamente dos registros reais do jogador.
 * Quando não há dados suficientes, os campos ficam nulos e a interface explica.
 */
import type { CategoryId } from '../content/types';
import { CATEGORIES } from '../content/categories';
import { CONCEPT_IDS, type ConceptId } from '../content/concepts';
import type { Catalog } from './catalog';
import { conceptMastery, type MasteryState } from './mastery';
import { completedMissionIds, type GameState } from './state';
import { streakInfo } from './streak';

export const MIN_STEPS_FOR_ACCURACY = 3;

export interface CategoryReport {
  id: CategoryId;
  name: string;
  steps: number;
  /** null quando há menos de MIN_STEPS_FOR_ACCURACY etapas. */
  accuracy: number | null;
  firstTryRate: number | null;
  missionsDone: number;
  missionsTotal: number;
  /** Precisão das últimas tentativas (mais antiga → mais recente). */
  trend: number[];
}

export interface StatsReport {
  missionsStarted: number;
  runsCompleted: number;
  runsFailed: number;
  uniqueCompleted: number;
  totalMissions: number;
  completionRate: number | null;
  overallAccuracy: number | null;
  totalTimeMs: number;
  averageRunMs: number | null;
  totalAttempts: number;
  streak: { current: number; longest: number };
  categories: CategoryReport[];
  mastery: Record<MasteryState, ConceptId[]>;
  needsReview: ConceptId[];
  strengths: CategoryReport[];
  weaknesses: CategoryReport[];
  bestTypingWpm: number;
}

export function buildStats(state: GameState, catalog: Catalog, now: number): StatsReport {
  const s = state.progress.stats;
  const completed = completedMissionIds(state);
  const finishedRuns = s.runsCompleted + s.runsFailed;

  const categories: CategoryReport[] = CATEGORIES.map((c) => {
    const cs = s.categories[c.id];
    const steps = cs?.steps ?? 0;
    const enough = steps >= MIN_STEPS_FOR_ACCURACY;
    const missions = catalog.missions.filter((m) => m.category === c.id);
    return {
      id: c.id,
      name: c.short,
      steps,
      accuracy: enough ? cs!.scoreSum / steps : null,
      firstTryRate: enough ? cs!.firstTry / steps : null,
      missionsDone: missions.filter((m) => completed.has(m.id)).length,
      missionsTotal: missions.length,
      trend: state.attempts.filter((a) => a.category === c.id).slice(-8).map((a) => a.accuracy),
    };
  });

  const mastery: Record<MasteryState, ConceptId[]> = { 'nao-estudado': [], aprendendo: [], praticado: [], dominado: [] };
  const needsReview: ConceptId[] = [];
  for (const id of CONCEPT_IDS) {
    const info = conceptMastery(state, id, now);
    mastery[info.state].push(id);
    if (info.struggling || info.reviewDue) needsReview.push(id);
  }

  const totalSteps = categories.reduce((sum, c) => sum + c.steps, 0);
  const scoreSum = CATEGORIES.reduce((sum, c) => sum + (s.categories[c.id]?.scoreSum ?? 0), 0);
  const measured = categories.filter((c) => c.accuracy !== null);

  return {
    missionsStarted: s.missionsStarted,
    runsCompleted: s.runsCompleted,
    runsFailed: s.runsFailed,
    uniqueCompleted: completed.size,
    totalMissions: catalog.missions.length,
    completionRate: s.missionsStarted > 0 ? Math.min(1, s.runsCompleted / s.missionsStarted) : null,
    overallAccuracy: totalSteps >= MIN_STEPS_FOR_ACCURACY ? scoreSum / totalSteps : null,
    totalTimeMs: s.totalTimeMs,
    averageRunMs: finishedRuns > 0 ? s.totalTimeMs / finishedRuns : null,
    totalAttempts: state.attempts.length,
    streak: streakInfo(state.progress.activeDays, now),
    categories,
    mastery,
    needsReview,
    strengths: measured.filter((c) => c.accuracy! >= 0.85).sort((a, b) => b.accuracy! - a.accuracy!),
    weaknesses: measured.filter((c) => c.accuracy! < 0.65).sort((a, b) => a.accuracy! - b.accuracy!),
    bestTypingWpm: s.bestTypingWpm,
  };
}
