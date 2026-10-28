/**
 * Exportação e importação de backups.
 *
 * O arquivo importado é tratado como não confiável: limite de tamanho, envelope
 * verificado, migração, validação campo a campo, XP limitado a um teto plausível e
 * conquistas reavaliadas pelas regras do jogo. Num jogo que roda inteiro no navegador
 * isso não impede que alguém edite os próprios dados; apenas evita valores absurdos e
 * dados corrompidos.
 */
import type { Catalog } from '../domain/catalog';
import { ACHIEVEMENTS, buildAchievementContext } from '../domain/achievements';
import { completedMissionIds, type GameState } from '../domain/state';
import { maxFirstCompletionXp, ASSESSMENT_XP, TRAINING_DAILY_CAP } from '../domain/xp';
import { levelFromXp } from '../domain/xp';
import { APP_ID, decodeSave, encodeSave } from './codec';

export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;

export function exportBackup(state: GameState, now: number): string {
  return JSON.stringify({ ...encodeSave(state, now), kind: 'backup', exportedAt: new Date(now).toISOString() }, null, 2);
}

export function backupFileName(now: number): string {
  const d = new Date(now);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `nexo-backup-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`;
}

export interface BackupPreview {
  level: number;
  xp: number;
  missionsCompleted: number;
  achievements: number;
  savedAt: number | null;
}

export type ImportResult =
  | { ok: true; state: GameState; preview: BackupPreview; adjustments: string[] }
  | { ok: false; error: string };

/** Teto de XP plausível para o progresso apresentado. */
export function plausibleXpCap(state: GameState, catalog: Catalog): number {
  let cap = ASSESSMENT_XP;
  for (const [id, record] of Object.entries(state.progress.missions)) {
    const mission = catalog.missionById.get(id);
    if (!mission || record.completions === 0) continue;
    const max = maxFirstCompletionXp(mission);
    // primeira conclusão + melhorias (≤ 50% da base) + revisões (≤ 20% da base cada)
    cap += max * 1.5 + max * 0.2 * Math.max(0, record.completions - 1);
  }
  cap += TRAINING_DAILY_CAP * Math.max(1, state.progress.activeDays.length);
  return Math.ceil(cap);
}

export function importBackup(text: string, catalog: Catalog, now: number): ImportResult {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) return { ok: false, error: 'Arquivo grande demais para um backup do Nexo (limite de 2 MB).' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'O arquivo não é um JSON válido.' };
  }
  if (typeof parsed !== 'object' || parsed === null || (parsed as { app?: unknown }).app !== APP_ID) {
    return { ok: false, error: 'Este arquivo não é um backup do Nexo.' };
  }
  const decoded = decodeSave(parsed, now);
  if (decoded.status !== 'ok') return { ok: false, error: decoded.message };

  const adjustments = [...decoded.issues];
  let state = decoded.state;

  // Registros de missões que não existem mais no conteúdo atual não contam.
  const unknown = Object.keys(state.progress.missions).filter((id) => !catalog.missionById.has(id));
  if (unknown.length > 0) adjustments.push(`${unknown.length} registro(s) de missões desconhecidas foram ignorados.`);

  const cap = plausibleXpCap(state, catalog);
  if (state.progress.xp > cap) {
    adjustments.push(`XP ajustado de ${state.progress.xp} para ${cap}, o máximo compatível com o progresso registrado.`);
    state = { ...state, progress: { ...state.progress, xp: cap } };
  }

  const ctx = buildAchievementContext(state, catalog, now);
  const achievements: Record<string, number> = {};
  let dropped = 0;
  for (const [id, at] of Object.entries(state.progress.achievements)) {
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    if (def && def.check(ctx)) achievements[id] = Math.min(at, now);
    else dropped++;
  }
  if (dropped > 0) adjustments.push(`${dropped} conquista(s) sem a condição cumprida foram removidas.`);
  state = { ...state, updatedAt: now, progress: { ...state.progress, achievements } };

  const savedAt = (parsed as { savedAt?: unknown }).savedAt;
  return {
    ok: true,
    state,
    adjustments,
    preview: {
      level: levelFromXp(state.progress.xp).level,
      xp: state.progress.xp,
      missionsCompleted: [...completedMissionIds(state)].filter((id) => catalog.missionById.has(id)).length,
      achievements: Object.keys(achievements).length,
      savedAt: typeof savedAt === 'number' ? savedAt : null,
    },
  };
}
