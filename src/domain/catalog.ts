/**
 * Catálogo de conteúdo injetável. As regras de domínio recebem o catálogo como
 * parâmetro para que os testes possam usar missões sintéticas.
 */
import type { MissionDefinition, SectorDefinition } from '../content/types';
import { MISSIONS } from '../content/missions';
import { SECTORS } from '../content/sectors';

export interface Catalog {
  missions: MissionDefinition[];
  sectors: SectorDefinition[];
  missionById: Map<string, MissionDefinition>;
}

export function createCatalog(missions: MissionDefinition[], sectors: SectorDefinition[]): Catalog {
  return { missions, sectors, missionById: new Map(missions.map((m) => [m.id, m])) };
}

export const DEFAULT_CATALOG = createCatalog(MISSIONS, SECTORS);
