/**
 * Codificação do save: envelope versionado → migração → validação.
 */
import { SCHEMA_VERSION, type GameState } from '../domain/state';
import { MigrationError, migrate, type Migration, MIGRATIONS } from './migrations';
import { sanitizeState } from './sanitize';

export const APP_ID = 'nexo';

export interface SaveEnvelope {
  app: typeof APP_ID;
  schemaVersion: number;
  savedAt: number;
  data: GameState;
}

export function encodeSave(state: GameState, now: number): SaveEnvelope {
  return { app: APP_ID, schemaVersion: SCHEMA_VERSION, savedAt: now, data: state };
}

export type DecodeResult =
  | { status: 'ok'; state: GameState; issues: string[]; migratedFrom: number | null }
  | { status: 'newer'; version: number; message: string }
  | { status: 'invalid'; message: string };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

export function decodeSave(raw: unknown, now: number, migrations: Record<number, Migration> = MIGRATIONS, target = SCHEMA_VERSION): DecodeResult {
  if (!isObj(raw)) return { status: 'invalid', message: 'O save não é um objeto.' };
  if (raw.app !== APP_ID) return { status: 'invalid', message: 'O arquivo não pertence ao Nexo.' };
  const version = raw.schemaVersion;
  if (typeof version !== 'number' || !Number.isInteger(version)) return { status: 'invalid', message: 'Versão do save ausente.' };
  if (version > target) {
    return {
      status: 'newer',
      version,
      message: `Este progresso foi salvo por uma versão mais nova do jogo (formato ${version}). Atualize a página para carregar a versão mais recente.`,
    };
  }
  if (!isObj(raw.data)) return { status: 'invalid', message: 'O save não contém dados.' };
  let data: Record<string, unknown> = raw.data;
  let migratedFrom: number | null = null;
  if (version < target) {
    try {
      data = migrate(data, version, target, migrations).data;
      migratedFrom = version;
    } catch (error) {
      return { status: 'invalid', message: error instanceof MigrationError ? error.message : 'Falha ao migrar os dados.' };
    }
  }
  const { state, issues } = sanitizeState(data, now);
  return { status: 'ok', state, issues, migratedFrom };
}
