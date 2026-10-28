/**
 * Recomendações determinísticas e explicáveis.
 *
 * Para cada missão jogável calcula-se uma pontuação a partir de:
 * - áreas de dificuldade marcadas no onboarding;
 * - distância entre a dificuldade da missão e a dificuldade-alvo do jogador naquela
 *   categoria (nível declarado ajustado pela avaliação e pela precisão real);
 * - continuidade (pré-requisito recém-concluído);
 * - conceitos com erros recentes (reforço) ou prontos para revisão espaçada;
 * - ordem natural da campanha (setores e missões anteriores primeiro).
 * Cada ponto somado gera uma razão legível, exibida ao jogador.
 */
import type { CategoryId, MissionDefinition, StartingLevel } from '../content/types';
import type { ConceptId } from '../content/concepts';
import { CONCEPTS } from '../content/concepts';
import { getCategory } from '../content/categories';
import type { Catalog } from './catalog';
import { conceptMastery } from './mastery';
import type { GameState } from './state';
import { missionStatus, unlockedSectors } from './unlock';
import { REVIEW_INTERVAL_HOURS } from './xp';

export type RecommendationType = 'nova' | 'revisao' | 'reforco';

export interface Recommendation {
  mission: MissionDefinition;
  score: number;
  type: RecommendationType;
  reasons: string[];
}

const LEVEL_TARGET: Record<StartingLevel, number> = { iniciante: 1, casual: 1.6, veterano: 2.4, mestre: 3 };

/** Dificuldade-alvo (1..4) do jogador em uma categoria. */
export function targetDifficulty(state: GameState, category: CategoryId): number {
  let target = LEVEL_TARGET[state.profile.startingLevel ?? 'iniciante'];
  const assessed = state.profile.assessment?.perCategory[category];
  if (assessed && assessed.total > 0) target += assessed.correct / assessed.total >= 0.5 ? 0.4 : -0.4;
  const stats = state.progress.stats.categories[category];
  if (stats && stats.steps >= 4) {
    const accuracy = stats.scoreSum / stats.steps;
    if (accuracy >= 0.85) target += 0.6;
    else if (accuracy < 0.6) target -= 0.6;
  }
  return Math.min(4, Math.max(1, target));
}

/** Categoria com dificuldade recente: 2+ missões não aprovadas nas últimas 10 tentativas. */
export function strugglingCategories(state: GameState): Set<CategoryId> {
  const recent = state.attempts.filter((a) => a.kind === 'missao').slice(-10);
  const fails = new Map<CategoryId, number>();
  for (const a of recent) if (!a.passed) fails.set(a.category, (fails.get(a.category) ?? 0) + 1);
  return new Set([...fails].filter(([, n]) => n >= 2).map(([c]) => c));
}

export function recommendMissions(state: GameState, catalog: Catalog, now: number, limit = 3): Recommendation[] {
  const sectors = unlockedSectors(state, catalog);
  const focus = new Set(state.profile.wantsEverything ? [] : state.profile.focusAreas);
  const struggling = strugglingCategories(state);
  const sectorOrder = new Map(catalog.sectors.map((s) => [s.id, s.order]));
  const candidates: Recommendation[] = [];

  for (const mission of catalog.missions) {
    const status = missionStatus(mission, state, catalog, sectors);
    const record = state.progress.missions[mission.id];
    const categoryName = getCategory(mission.category).short;
    const reasons: string[] = [];
    let score = 50 - ((sectorOrder.get(mission.sector) ?? 1) - 1) * 4 - mission.order;

    if (status === 'concluida') {
      const last = record?.lastCompletedAt ?? 0;
      if ((now - last) / 3_600_000 < REVIEW_INTERVAL_HOURS) continue;
      const infos = mission.concepts.map((c) => ({ c, m: conceptMastery(state, c, now) }));
      const weak = infos.filter((i) => i.m.struggling);
      const due = infos.filter((i) => i.m.reviewDue);
      if (weak.length > 0) {
        score += 35;
        reasons.push(`Reforço: você errou recentemente ${CONCEPTS[weak[0]!.c as ConceptId]}.`);
        candidates.push({ mission, score, type: 'reforco', reasons });
      } else if (due.length > 0) {
        score += 20;
        reasons.push(`Revisão espaçada: rever ${CONCEPTS[due[0]!.c as ConceptId]} agora ajuda a fixar o conteúdo.`);
        candidates.push({ mission, score, type: 'revisao', reasons });
      }
      continue;
    }
    if (status !== 'disponivel') continue;

    if (focus.has(mission.category)) {
      score += 30;
      reasons.push(`Você marcou ${categoryName} como uma área para melhorar.`);
    }
    const target = targetDifficulty(state, mission.category);
    const distance = Math.abs(mission.difficulty - target);
    score += 20 - 12 * distance;
    if (distance <= 0.6) reasons.push('A dificuldade combina com o seu desempenho atual.');

    if (struggling.has(mission.category)) {
      if (mission.difficulty <= Math.round(target)) {
        score += 15;
        reasons.push(`Uma missão mais acessível para reforçar a base de ${categoryName}.`);
      } else score -= 25;
    }

    const recentPrereq = mission.prerequisites
      .map((id) => ({ id, at: state.progress.missions[id]?.lastCompletedAt ?? 0 }))
      .sort((a, b) => b.at - a.at)[0];
    if (recentPrereq && now - recentPrereq.at < 7 * 86_400_000) {
      score += 10;
      reasons.push(`Continua de onde você parou: ${catalog.missionById.get(recentPrereq.id)?.title ?? 'missão anterior'}.`);
    }

    if (record && record.failures > 0) {
      score += 8;
      reasons.push('Você já tentou esta missão; com a explicação fresca, vale uma nova tentativa.');
    }

    if (reasons.length === 0) reasons.push('Próximo passo natural da campanha.');
    candidates.push({ mission, score, type: 'nova', reasons });
  }

  candidates.sort((a, b) => b.score - a.score || a.mission.id.localeCompare(b.mission.id));
  // Variedade: no máximo 2 recomendações da mesma categoria.
  const picked: Recommendation[] = [];
  const perCategory = new Map<CategoryId, number>();
  for (const c of candidates) {
    const n = perCategory.get(c.mission.category) ?? 0;
    if (n >= 2) continue;
    picked.push(c);
    perCategory.set(c.mission.category, n + 1);
    if (picked.length >= limit) break;
  }
  return picked;
}

export interface CodexSuggestion {
  concept: ConceptId;
  reason: string;
}

/** Conceitos com erros recentes: sugerir a leitura do Codex antes de tentar de novo. */
export function codexSuggestions(state: GameState, now: number, limit = 3): CodexSuggestion[] {
  return (Object.keys(state.progress.concepts) as ConceptId[])
    .filter((c) => c in CONCEPTS)
    .map((c) => ({ c, m: conceptMastery(state, c, now) }))
    .filter(({ m }) => m.struggling)
    .sort((a, b) => (b.m.lastAt ?? 0) - (a.m.lastAt ?? 0))
    .slice(0, limit)
    .map(({ c }) => ({ concept: c, reason: 'Você errou este conceito recentemente. Uma leitura rápida no Codex ajuda antes da próxima tentativa.' }));
}
