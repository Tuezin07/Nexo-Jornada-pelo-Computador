/**
 * Domínio de conceitos.
 *
 * Estados:
 * - nao-estudado: nenhuma evidência.
 * - aprendendo: há evidências, mas ainda não consistentes.
 * - praticado: pelo menos 2 acertos e precisão recente ≥ 60%.
 * - dominado: pelo menos 3 acertos, 2 deles de primeira, distribuídos em momentos
 *   separados por pelo menos REVIEW_GAP_HOURS (houve uma revisão posterior), precisão
 *   recente ≥ 80% e a evidência mais recente correta.
 * Tempo de execução nunca é critério de domínio.
 */
import type { ConceptId } from '../content/concepts';
import type { ConceptEvidence, GameState } from './state';

export type MasteryState = 'nao-estudado' | 'aprendendo' | 'praticado' | 'dominado';

export const REVIEW_GAP_HOURS = 20;
export const STALE_DAYS = 21;
const RECENT = 5;

export const MASTERY_LABEL: Record<MasteryState, string> = {
  'nao-estudado': 'Não estudado',
  aprendendo: 'Em aprendizado',
  praticado: 'Praticado',
  dominado: 'Dominado',
};

export interface MasteryInfo {
  state: MasteryState;
  correct: number;
  total: number;
  recentAccuracy: number;
  /** Errou recentemente ou tem precisão baixa: precisa de reforço. */
  struggling: boolean;
  /** Pronto para uma revisão espaçada (o que leva ao domínio ou o mantém). */
  reviewDue: boolean;
  lastAt: number | null;
}

export function masteryOf(evidence: ConceptEvidence[] | undefined, now: number): MasteryInfo {
  const list = [...(evidence ?? [])].sort((a, b) => a.at - b.at);
  if (list.length === 0) {
    return { state: 'nao-estudado', correct: 0, total: 0, recentAccuracy: 0, struggling: false, reviewDue: false, lastAt: null };
  }
  const correctList = list.filter((e) => e.correct);
  const recent = list.slice(-RECENT);
  const recentAccuracy = recent.filter((e) => e.correct).length / recent.length;
  const last = list[list.length - 1]!;
  const firstTryCorrect = correctList.filter((e) => e.firstTry).length;
  const spanHours =
    correctList.length >= 2 ? (correctList[correctList.length - 1]!.at - correctList[0]!.at) / 3_600_000 : 0;

  let state: MasteryState = 'aprendendo';
  if (correctList.length >= 3 && firstTryCorrect >= 2 && spanHours >= REVIEW_GAP_HOURS && recentAccuracy >= 0.8 && last.correct) {
    state = 'dominado';
  } else if (correctList.length >= 2 && recentAccuracy >= 0.6) {
    state = 'praticado';
  }

  const struggling = !last.correct || recentAccuracy < 0.6;
  const lastCorrectAt = correctList.length > 0 ? correctList[correctList.length - 1]!.at : null;
  const hoursSinceCorrect = lastCorrectAt === null ? Infinity : (now - lastCorrectAt) / 3_600_000;
  const reviewDue =
    !struggling &&
    ((state === 'praticado' && hoursSinceCorrect >= REVIEW_GAP_HOURS) ||
      (state === 'dominado' && hoursSinceCorrect >= STALE_DAYS * 24));

  return {
    state,
    correct: correctList.length,
    total: list.length,
    recentAccuracy,
    struggling,
    reviewDue,
    lastAt: last.at,
  };
}

export function conceptMastery(state: GameState, concept: ConceptId, now: number): MasteryInfo {
  return masteryOf(state.progress.concepts[concept], now);
}

export function masterySummary(state: GameState, concepts: readonly ConceptId[], now: number): Record<MasteryState, number> {
  const summary: Record<MasteryState, number> = { 'nao-estudado': 0, aprendendo: 0, praticado: 0, dominado: 0 };
  for (const c of concepts) summary[conceptMastery(state, c, now).state]++;
  return summary;
}
