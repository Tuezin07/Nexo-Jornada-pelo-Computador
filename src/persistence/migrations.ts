/**
 * Migrações de esquema do save local.
 *
 * Cada entrada transforma dados da versão N (chave) para N + 1. Ao mudar o formato
 * de `GameState`: incremente SCHEMA_VERSION em domain/state.ts e adicione aqui a
 * migração da versão anterior. Migrações devem ser puras e tolerantes a campos ausentes;
 * o resultado sempre passa por `sanitizeState` depois.
 */
import { SCHEMA_VERSION } from '../domain/state';

export type Migration = (data: Record<string, unknown>) => Record<string, unknown>;

/** Versão 1 é a primeira publicada; ainda não há migrações. */
export const MIGRATIONS: Record<number, Migration> = {};

export class MigrationError extends Error {}

export function migrate(
  data: Record<string, unknown>,
  fromVersion: number,
  toVersion: number = SCHEMA_VERSION,
  migrations: Record<number, Migration> = MIGRATIONS,
): { data: Record<string, unknown>; applied: number[] } {
  if (!Number.isInteger(fromVersion) || fromVersion < 1) throw new MigrationError(`Versão de dados inválida: ${fromVersion}`);
  if (fromVersion > toVersion) {
    throw new MigrationError(`Os dados vêm de uma versão mais nova do jogo (${fromVersion}) do que esta (${toVersion}).`);
  }
  let current = data;
  const applied: number[] = [];
  for (let version = fromVersion; version < toVersion; version++) {
    const step = migrations[version];
    if (!step) throw new MigrationError(`Falta a migração da versão ${version} para ${version + 1}.`);
    current = { ...step(structuredClone(current)), schemaVersion: version + 1 };
    applied.push(version);
  }
  return { data: current, applied };
}
