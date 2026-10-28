import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { applyMissionResult, recordMissionStart } from '../../src/domain/progress';
import { SCHEMA_VERSION, dayKey, type GameState } from '../../src/domain/state';
import { MAX_BACKUP_BYTES, backupFileName, exportBackup, importBackup, plausibleXpCap } from '../../src/persistence/backup';
import { PREVIOUS_KEY, createRepository, IndexedDbStore } from '../../src/persistence/repository';
import { GameStore } from '../../src/state/store';
import { HOUR, MINUTE, MISSION_A, MISSION_C, T0, freshState, playQuizMission, syntheticCatalog } from '../helpers/fixtures';

const catalog = syntheticCatalog();

/** Estado com duas missões concluídas (uma perfeita, outra com erros). */
function played(): GameState {
  let state = recordMissionStart(recordMissionStart(freshState(), MISSION_A, T0 - MINUTE), MISSION_C, T0);
  state = applyMissionResult(state, MISSION_A, playQuizMission(MISSION_A, 'run-a', T0 - MINUTE, T0), catalog, T0).state;
  state = applyMissionResult(state, MISSION_C, playQuizMission(MISSION_C, 'run-c', T0, T0 + MINUTE, { wrongFirst: [0] }), catalog, T0 + MINUTE).state;
  return { ...state, profile: { ...state.profile, nickname: 'Backup' }, preferences: { ...state.preferences, theme: 'claro' } };
}

/** Exporta, modifica o JSON e devolve o texto. */
function tamper(state: GameState, change: (json: Record<string, any>) => void): string {
  const json = JSON.parse(exportBackup(state, T0 + HOUR)) as Record<string, any>;
  change(json);
  return JSON.stringify(json);
}

describe('exportBackup → importBackup', () => {
  it('restaura o progresso exatamente', () => {
    const state = played();
    const text = exportBackup(state, T0 + HOUR);
    const parsed = JSON.parse(text);
    expect(parsed).toMatchObject({ app: 'nexo', schemaVersion: SCHEMA_VERSION, savedAt: T0 + HOUR, kind: 'backup' });

    const result = importBackup(text, catalog, T0 + 2 * HOUR);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.adjustments).toEqual([]);
    expect(result.state.progress).toEqual(state.progress);
    expect(result.state.profile).toEqual(state.profile);
    expect(result.state.preferences).toEqual(state.preferences);
    expect(result.state.attempts).toEqual(state.attempts);
    expect(result.state.history).toEqual(state.history);
    expect(result.state.updatedAt).toBe(T0 + 2 * HOUR);
    expect(result.preview).toEqual({
      level: 2,
      xp: state.progress.xp,
      missionsCompleted: 2,
      achievements: Object.keys(state.progress.achievements).length,
      savedAt: T0 + HOUR,
    });
  });

  it('nome do arquivo com data e hora', () => {
    expect(backupFileName(new Date(2026, 2, 5, 9, 7).getTime())).toBe('nexo-backup-20260305-0907.json');
  });

  it('pela store: exportar, importar em outro navegador (outro banco) e recarregar', async () => {
    const source = new GameStore({ repository: () => createRepository({ indexedDB: new IDBFactory() }), catalog, clock: () => T0 });
    await source.init();
    await source.startMission(MISSION_A);
    await source.finishMission(MISSION_A, playQuizMission(MISSION_A, 'run-1', T0 - MINUTE, T0));
    const text = source.exportBackup();

    const factory = new IDBFactory();
    const target = new GameStore({ repository: () => createRepository({ indexedDB: factory }), catalog, clock: () => T0 + HOUR });
    await target.init();
    await target.setProfile({ nickname: 'Antes' });
    const preview = target.previewImport(text);
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    expect(await target.applyImport(preview.state)).toBe(true);
    expect(target.state.progress.xp).toBe(source.state.progress.xp);

    // o save anterior foi guardado antes da importação
    const raw = await IndexedDbStore.open(factory);
    const previous = (await raw.get(PREVIOUS_KEY)) as { data: GameState };
    expect(previous.data.profile.nickname).toBe('Antes');

    const reloaded = new GameStore({ repository: () => createRepository({ indexedDB: factory }), catalog, clock: () => T0 + 2 * HOUR });
    await reloaded.init();
    expect(reloaded.state.progress).toEqual(source.state.progress);
  });
});

describe('arquivos recusados', () => {
  it('não-JSON', () => {
    expect(importBackup('isto não é json {', catalog, T0)).toEqual({ ok: false, error: 'O arquivo não é um JSON válido.' });
  });

  it('JSON de outro app', () => {
    expect(importBackup(JSON.stringify({ app: 'outro-jogo', schemaVersion: 1, data: {} }), catalog, T0)).toEqual({
      ok: false,
      error: 'Este arquivo não é um backup do Nexo.',
    });
    expect(importBackup('[1,2,3]', catalog, T0).ok).toBe(false);
    expect(importBackup('null', catalog, T0).ok).toBe(false);
  });

  it('grande demais (> 2 MB), mesmo sendo JSON válido', () => {
    const big = tamper(played(), (json) => {
      json.padding = 'x'.repeat(MAX_BACKUP_BYTES);
    });
    const result = importBackup(big, catalog, T0);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/grande demais/);
    expect(importBackup('x'.repeat(MAX_BACKUP_BYTES + 1), catalog, T0).ok).toBe(false);
  });

  it('de uma versão mais nova', () => {
    const newer = tamper(played(), (json) => {
      json.schemaVersion = SCHEMA_VERSION + 1;
    });
    const result = importBackup(newer, catalog, T0);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/versão mais nova/);
  });

  it('envelope sem dados', () => {
    expect(importBackup(JSON.stringify({ app: 'nexo', schemaVersion: SCHEMA_VERSION }), catalog, T0).ok).toBe(false);
  });
});

describe('arquivos adulterados', () => {
  it('XP absurdo é ajustado ao teto plausível', () => {
    const state = played();
    const text = tamper(state, (json) => {
      json.data.progress.xp = 9_999_999;
    });
    const result = importBackup(text, catalog, T0 + HOUR);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const cap = plausibleXpCap(result.state, catalog);
    expect(cap).toBeLessThan(1000);
    expect(cap).toBeGreaterThanOrEqual(state.progress.xp);
    expect(result.state.progress.xp).toBe(cap);
    expect(result.preview.xp).toBe(cap);
    expect(result.adjustments.some((a) => a.startsWith(`XP ajustado de 9999999 para ${cap}`))).toBe(true);
  });

  it('XP legítimo não é alterado', () => {
    const state = played();
    expect(state.progress.xp).toBeLessThanOrEqual(plausibleXpCap(state, catalog));
    const result = importBackup(exportBackup(state, T0), catalog, T0);
    expect(result.ok && result.state.progress.xp).toBe(state.progress.xp);
  });

  it('teto cresce com missões concluídas e dias ativos, não com missões desconhecidas', () => {
    const base = freshState();
    const empty = plausibleXpCap(base, catalog);
    const withUnknown: GameState = {
      ...base,
      progress: { ...base.progress, missions: { 'missao-fantasma': { ...played().progress.missions['f01-alfa']!, completions: 50 } } },
    };
    expect(plausibleXpCap(withUnknown, catalog)).toBe(empty);
    const days: GameState = { ...base, progress: { ...base.progress, activeDays: [dayKey(T0), dayKey(T0 - 86_400_000)] } };
    expect(plausibleXpCap(days, catalog)).toBeGreaterThan(empty);
    expect(plausibleXpCap(played(), catalog)).toBeGreaterThan(empty);
  });

  it('conquistas falsas são removidas; legítimas ficam', () => {
    const state = played();
    expect(Object.keys(state.progress.achievements).sort()).toEqual(['primeiro-passo', 'sem-arranhoes']);
    const text = tamper(state, (json) => {
      json.data.progress.achievements = {
        ...json.data.progress.achievements,
        'primeiro-passo': T0 + 10 * 86_400_000, // data no futuro
        'nivel-10': T0, // XP insuficiente
        'mao-firme': T0, // só 1 missão sem erros
        'setor-fundamentos': T0, // falta uma missão do setor
        'conquista-inventada': T0, // não existe
      };
    });
    const result = importBackup(text, catalog, T0 + HOUR);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.progress.achievements).toEqual({ 'primeiro-passo': T0 + HOUR, 'sem-arranhoes': state.progress.achievements['sem-arranhoes'] });
    expect(result.preview.achievements).toBe(2);
    expect(result.adjustments).toContain('3 conquista(s) sem a condição cumprida foram removidas.');
  });

  it('registros de missões desconhecidas são sinalizados e não contam', () => {
    const text = tamper(played(), (json) => {
      json.data.progress.missions['missao-removida'] = { completions: 3, bestAccuracy: 1 };
    });
    const result = importBackup(text, catalog, T0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.adjustments).toContain('1 registro(s) de missões desconhecidas foram ignorados.');
    expect(result.preview.missionsCompleted).toBe(2);
  });

  it('campos corrompidos são reparados e informados', () => {
    const text = tamper(played(), (json) => {
      json.data.profile = 'quebrado';
      json.data.preferences.volume = 42;
    });
    const result = importBackup(text, catalog, T0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.preferences.volume).toBe(1);
    expect(result.state.profile.nickname).toBe('Agente');
    expect(result.adjustments.length).toBeGreaterThan(0);
  });
});
