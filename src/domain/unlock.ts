/**
 * Regras de desbloqueio de setores e missões.
 * O nível declarado no onboarding apenas ABRE setores mais cedo; nunca bloqueia
 * conteúdo. Uma vez que o jogador cumpre uma regra por progresso, o setor abre
 * para qualquer nível declarado.
 */
import type { MissionDefinition, SectorDefinition, SectorId, SectorUnlockRule, StartingLevel } from '../content/types';
import type { Catalog } from './catalog';
import { completedMissionIds, type GameState } from './state';

export const LEVEL_ORDER: Record<StartingLevel, number> = { iniciante: 0, casual: 1, veterano: 2, mestre: 3 };

function completedInSector(state: GameState, catalog: Catalog, sector: SectorId): number {
  const done = completedMissionIds(state);
  return catalog.missions.filter((m) => m.sector === sector && done.has(m.id)).length;
}

export function ruleSatisfied(rule: SectorUnlockRule, state: GameState, catalog: Catalog): boolean {
  switch (rule.type) {
    case 'always':
      return true;
    case 'completedInSector':
      return completedInSector(state, catalog, rule.sector) >= rule.count;
    case 'startingLevel':
      return state.profile.startingLevel !== null && LEVEL_ORDER[state.profile.startingLevel] >= LEVEL_ORDER[rule.min];
    case 'assessmentScore': {
      const a = state.profile.assessment;
      return Boolean(a && !a.skipped && a.score >= rule.min);
    }
  }
}

export function isSectorUnlocked(sector: SectorDefinition, state: GameState, catalog: Catalog): boolean {
  return sector.unlock.some((rule) => ruleSatisfied(rule, state, catalog));
}

export function unlockedSectors(state: GameState, catalog: Catalog): Set<SectorId> {
  return new Set(catalog.sectors.filter((s) => isSectorUnlocked(s, state, catalog)).map((s) => s.id));
}

export type MissionStatus = 'bloqueada-setor' | 'bloqueada-requisito' | 'disponivel' | 'concluida';

export function missingPrerequisites(mission: MissionDefinition, state: GameState, catalog: Catalog): MissionDefinition[] {
  const done = completedMissionIds(state);
  return mission.prerequisites
    .filter((id) => !done.has(id))
    .map((id) => catalog.missionById.get(id))
    .filter((m): m is MissionDefinition => Boolean(m));
}

export function missionStatus(
  mission: MissionDefinition,
  state: GameState,
  catalog: Catalog,
  sectors: Set<SectorId> = unlockedSectors(state, catalog),
): MissionStatus {
  if ((state.progress.missions[mission.id]?.completions ?? 0) > 0) return 'concluida';
  if (!sectors.has(mission.sector)) return 'bloqueada-setor';
  if (missingPrerequisites(mission, state, catalog).length > 0) return 'bloqueada-requisito';
  return 'disponivel';
}

/** Uma missão pode ser jogada se está disponível ou já foi concluída (revisão). */
export function isPlayable(mission: MissionDefinition, state: GameState, catalog: Catalog): boolean {
  const status = missionStatus(mission, state, catalog);
  return status === 'disponivel' || status === 'concluida';
}

export function sectorProgress(sector: SectorId, state: GameState, catalog: Catalog): { done: number; total: number } {
  const total = catalog.missions.filter((m) => m.sector === sector).length;
  return { done: completedInSector(state, catalog, sector), total };
}
