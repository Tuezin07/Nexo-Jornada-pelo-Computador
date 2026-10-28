import type { MissionDefinition, SectorId } from '../types';
import { FUNDAMENTOS_MISSIONS } from './fundamentos';
import { SISTEMA_MISSIONS } from './sistema';
import { REDE_SEGURA_MISSIONS } from './rede-segura';
import { DIAGNOSTICO_MISSIONS } from './diagnostico';
import { EFICIENCIA_MISSIONS } from './eficiencia';

export const MISSIONS: MissionDefinition[] = [
  ...FUNDAMENTOS_MISSIONS,
  ...SISTEMA_MISSIONS,
  ...REDE_SEGURA_MISSIONS,
  ...DIAGNOSTICO_MISSIONS,
  ...EFICIENCIA_MISSIONS,
];

const BY_ID = new Map(MISSIONS.map((m) => [m.id, m]));

export function getMission(id: string): MissionDefinition | undefined {
  return BY_ID.get(id);
}

export function missionsInSector(sector: SectorId): MissionDefinition[] {
  return MISSIONS.filter((m) => m.sector === sector).sort((a, b) => a.order - b.order);
}
