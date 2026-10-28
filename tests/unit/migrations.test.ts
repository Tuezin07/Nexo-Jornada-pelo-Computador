import { describe, expect, it } from 'vitest';
import { decodeSave, encodeSave } from '../../src/persistence/codec';
import { MIGRATIONS, MigrationError, migrate, type Migration } from '../../src/persistence/migrations';
import { SCHEMA_VERSION, createInitialState } from '../../src/domain/state';
import { T0 } from '../helpers/fixtures';

/**
 * Migrações sintéticas:
 * v1 → v2: `pontos` (número solto na raiz) vira `progress.xp`.
 * v2 → v3: `apelido` vira `profile.nickname`.
 */
const SYNTHETIC: Record<number, Migration> = {
  1: (data) => {
    const { pontos, ...rest } = data;
    const progress = (rest.progress as Record<string, unknown> | undefined) ?? {};
    return { ...rest, progress: { ...progress, xp: pontos } };
  },
  2: (data) => {
    const { apelido, ...rest } = data;
    const profile = (rest.profile as Record<string, unknown> | undefined) ?? {};
    return { ...rest, profile: { ...profile, nickname: apelido } };
  },
};

describe('migrate', () => {
  it('aplica v1 → v2 → v3 em ordem e marca a versão', () => {
    const result = migrate({ pontos: 250, apelido: 'Ana', schemaVersion: 1 }, 1, 3, SYNTHETIC);
    expect(result.applied).toEqual([1, 2]);
    expect(result.data).toEqual({ schemaVersion: 3, progress: { xp: 250 }, profile: { nickname: 'Ana' } });
  });

  it('parte de uma versão intermediária', () => {
    const result = migrate({ progress: { xp: 10 }, apelido: 'Bia' }, 2, 3, SYNTHETIC);
    expect(result.applied).toEqual([2]);
    expect(result.data).toMatchObject({ schemaVersion: 3, profile: { nickname: 'Bia' } });
  });

  it('não altera os dados de entrada', () => {
    const input = { pontos: 5, apelido: 'C', progress: { outro: 1 } };
    const copy = structuredClone(input);
    migrate(input, 1, 3, SYNTHETIC);
    expect(input).toEqual(copy);
  });

  it('mesma versão: nada a fazer', () => {
    const data = { a: 1 };
    expect(migrate(data, 3, 3, SYNTHETIC)).toEqual({ data, applied: [] });
  });

  it('erro quando falta um passo', () => {
    const gap = { 1: SYNTHETIC[1]! };
    expect(() => migrate({}, 1, 3, gap)).toThrow(MigrationError);
    expect(() => migrate({}, 1, 3, gap)).toThrow('Falta a migração da versão 2 para 3.');
  });

  it('erro para dados de versão mais nova', () => {
    expect(() => migrate({}, 4, 3, SYNTHETIC)).toThrow(MigrationError);
    expect(() => migrate({}, 4, 3, SYNTHETIC)).toThrow(/versão mais nova/);
  });

  it('erro para versão inválida', () => {
    for (const v of [0, -1, 1.5, Number.NaN]) expect(() => migrate({}, v, 3, SYNTHETIC)).toThrow(MigrationError);
  });

  it('padrão: versão atual sem migrações pendentes', () => {
    expect(SCHEMA_VERSION).toBe(1);
    expect(MIGRATIONS).toEqual({});
    expect(migrate({ x: 1 }, SCHEMA_VERSION).applied).toEqual([]);
  });
});

describe('decodeSave com migrações', () => {
  const envelope = (schemaVersion: unknown, data: unknown) => ({ app: 'nexo', schemaVersion, savedAt: T0, data });

  it('migra, valida e informa a versão de origem', () => {
    const decoded = decodeSave(envelope(1, { pontos: 420, apelido: 'Duda' }), T0, SYNTHETIC, 3);
    expect(decoded.status).toBe('ok');
    if (decoded.status !== 'ok') return;
    expect(decoded.migratedFrom).toBe(1);
    expect(decoded.state.progress.xp).toBe(420);
    expect(decoded.state.profile.nickname).toBe('Duda');
  });

  it('versão atual não migra', () => {
    const decoded = decodeSave(encodeSave(createInitialState(T0), T0), T0);
    expect(decoded).toMatchObject({ status: 'ok', migratedFrom: null, issues: [] });
  });

  it('falta de migração vira dado inválido (não exceção)', () => {
    const decoded = decodeSave(envelope(1, {}), T0, { 1: SYNTHETIC[1]! }, 3);
    expect(decoded).toEqual({ status: 'invalid', message: 'Falta a migração da versão 2 para 3.' });
  });

  it('versão mais nova é sinalizada à parte', () => {
    const decoded = decodeSave(envelope(5, {}), T0, SYNTHETIC, 3);
    expect(decoded.status).toBe('newer');
    if (decoded.status === 'newer') expect(decoded.version).toBe(5);
  });

  it('envelope inválido', () => {
    expect(decodeSave('texto', T0).status).toBe('invalid');
    expect(decodeSave({ app: 'outro', schemaVersion: 1, data: {} }, T0)).toEqual({ status: 'invalid', message: 'O arquivo não pertence ao Nexo.' });
    expect(decodeSave(envelope('1', {}), T0).status).toBe('invalid');
    expect(decodeSave(envelope(1, null), T0).status).toBe('invalid');
  });
});
