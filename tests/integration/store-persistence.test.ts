import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION, createInitialState, type GameState } from '../../src/domain/state';
import { encodeSave } from '../../src/persistence/codec';
import {
  CORRUPT_PREFIX,
  IndexedDbStore,
  KeyValueRepository,
  MemoryStore,
  SAVE_KEY,
  createRepository,
  type LoadOutcome,
  type ProgressRepository,
  type StorageKind,
} from '../../src/persistence/repository';
import { GameStore } from '../../src/state/store';
import { HOUR, MINUTE, MISSION_A, T0, playQuizMission, syntheticCatalog } from '../helpers/fixtures';

const catalog = syntheticCatalog();
const PERFECT_A = 72;

/** Store ligada a um IndexedDB isolado (fake-indexeddb), com relógio controlado. */
function makeStore(factory: IDBFactory, clock: { now: number }) {
  return new GameStore({ repository: () => createRepository({ indexedDB: factory }), catalog, clock: () => clock.now });
}

async function playA(store: GameStore, runId: string, at: number) {
  await store.startMission(MISSION_A);
  return store.finishMission(MISSION_A, playQuizMission(MISSION_A, runId, at - 5 * MINUTE, at));
}

describe('GameStore + IndexedDB', () => {
  it('progresso sobrevive a um "recarregamento" (nova store, mesmo banco)', async () => {
    const factory = new IDBFactory();
    const clock = { now: T0 };
    const store = makeStore(factory, clock);
    await store.init();
    expect(store.getSnapshot()).toMatchObject({ ready: true, storage: 'indexeddb', persistent: true, readOnly: false, notices: [] });

    const { report, saved } = await playA(store, 'run-1', T0);
    expect(saved).toBe(true);
    expect(report.xp.total).toBe(PERFECT_A);
    expect(store.getSnapshot().save).toEqual({ status: 'saved', error: null, lastSavedAt: T0 });

    clock.now = T0 + HOUR;
    const reloaded = makeStore(factory, clock);
    await reloaded.init();
    const state = reloaded.state;
    expect(state.progress.xp).toBe(PERFECT_A);
    expect(state.progress.missions['f01-alfa']).toMatchObject({ completions: 1, bestAccuracy: 1 });
    expect(state.progress.processedRuns).toEqual(['run-1']);
    expect(state.progress.achievements['primeiro-passo']).toBe(T0);
    expect(state.attempts).toHaveLength(1);
    expect(state.progress.stats.missionsStarted).toBe(1);
    expect(reloaded.getSnapshot().notices).toEqual([]);
    expect(state).toEqual(store.state);
  });

  it('depois de recarregar, reenviar o mesmo resultado não duplica XP', async () => {
    const factory = new IDBFactory();
    const clock = { now: T0 };
    const store = makeStore(factory, clock);
    await store.init();
    const summary = playQuizMission(MISSION_A, 'run-1', T0 - MINUTE, T0);
    await store.finishMission(MISSION_A, summary);

    const reloaded = makeStore(factory, clock);
    await reloaded.init();
    const { report } = await reloaded.finishMission(MISSION_A, summary);
    expect(report.alreadyProcessed).toBe(true);
    expect(reloaded.state.progress.xp).toBe(PERFECT_A);
  });

  it('gravações em sequência: o último estado é o que fica', async () => {
    const factory = new IDBFactory();
    const clock = { now: T0 };
    const store = makeStore(factory, clock);
    await store.init();
    const writes = [
      store.setPreferences({ volume: 0.2 }),
      store.setProfile({ nickname: 'Rita' }),
      store.finishMission(MISSION_A, playQuizMission(MISSION_A, 'run-1', T0 - MINUTE, T0)),
    ];
    await Promise.all(writes);
    const reloaded = makeStore(factory, clock);
    await reloaded.init();
    expect(reloaded.state.preferences.volume).toBe(0.2);
    expect(reloaded.state.profile.nickname).toBe('Rita');
    expect(reloaded.state.progress.xp).toBe(PERFECT_A);
    expect(store.getSnapshot().save.status).toBe('saved');
  });
});

describe('dados inválidos no IndexedDB', () => {
  it('lixo no save: load "recovered", cópia em save:corrompido:<ts> e o jogo continua', async () => {
    const factory = new IDBFactory();
    const raw = await IndexedDbStore.open(factory);
    await raw.set(SAVE_KEY, 'isto não é um save');

    const repo = await createRepository({ indexedDB: factory });
    const outcome = await repo.load(T0);
    expect(outcome).toMatchObject({ status: 'recovered', state: null, backupKey: `${CORRUPT_PREFIX}${T0}` });
    expect(await raw.get(`${CORRUPT_PREFIX}${T0}`)).toBe('isto não é um save');
    expect((await repo.readCorruptBackups()).map((b) => b.key)).toEqual([`${CORRUPT_PREFIX}${T0}`]);

    const clock = { now: T0 + 1000 };
    const store = makeStore(factory, clock);
    await store.init();
    const snap = store.getSnapshot();
    expect(snap.ready).toBe(true);
    expect(snap.readOnly).toBe(false);
    expect(snap.state).toEqual(createInitialState(T0 + 1000));
    expect(snap.notices.map((n) => n.tone)).toEqual(['warning']);
    expect(snap.notices[0]!.text).toMatch(/cópia dos dados originais foi guardada/);
    expect(await raw.get(`${CORRUPT_PREFIX}${T0 + 1000}`)).toBe('isto não é um save');

    // o jogo continua e volta a gravar normalmente
    const { saved } = await playA(store, 'run-1', T0 + 1000);
    expect(saved).toBe(true);
    const fresh = await (await createRepository({ indexedDB: factory })).load(T0 + 2000);
    expect(fresh.status).toBe('ok');
    if (fresh.status === 'ok') expect(fresh.state.progress.xp).toBe(PERFECT_A);
  });

  it('envelope quebrado com dados aproveitáveis: recupera o que era válido', async () => {
    const factory = new IDBFactory();
    const raw = await IndexedDbStore.open(factory);
    const data = createInitialState(T0);
    data.progress.xp = 300;
    data.profile.nickname = 'Lia';
    await raw.set(SAVE_KEY, { app: 'nexo', schemaVersion: 'um', savedAt: T0, data: { ...data, progress: { ...data.progress, achievements: { falsa: 1 } } } });

    const store = makeStore(factory, { now: T0 });
    await store.init();
    expect(store.state.progress.xp).toBe(300);
    expect(store.state.profile.nickname).toBe('Lia');
    expect(store.state.progress.achievements).toEqual({});
    expect(store.getSnapshot().notices[0]).toMatchObject({ tone: 'warning' });
    expect(await raw.keys()).toContain(`${CORRUPT_PREFIX}${T0}`);
  });

  it('campos inválidos dentro de um envelope válido: corrigidos com aviso', async () => {
    const factory = new IDBFactory();
    const raw = await IndexedDbStore.open(factory);
    const envelope = encodeSave(createInitialState(T0), T0) as unknown as { data: Record<string, unknown> };
    envelope.data.progress = 'quebrado';
    await raw.set(SAVE_KEY, envelope);
    const store = makeStore(factory, { now: T0 });
    await store.init();
    expect(store.getSnapshot().notices).toHaveLength(1);
    expect(store.getSnapshot().notices[0]!.text).toMatch(/inválidos e foram corrigidos/);
    expect(store.state.progress.xp).toBe(0);
  });
});

describe('save de uma versão mais nova', () => {
  it('store fica somente leitura e não sobrescreve', async () => {
    const factory = new IDBFactory();
    const raw = await IndexedDbStore.open(factory);
    const future = { app: 'nexo', schemaVersion: SCHEMA_VERSION + 1, savedAt: T0, data: { campoNovo: true, progress: { xp: 5000 } } };
    await raw.set(SAVE_KEY, future);

    const store = makeStore(factory, { now: T0 });
    await store.init();
    const snap = store.getSnapshot();
    expect(snap.readOnly).toBe(true);
    expect(snap.notices.map((n) => n.tone)).toEqual(['error']);
    expect(snap.notices[0]!.text).toMatch(/versão mais nova/);

    const { saved } = await playA(store, 'run-1', T0);
    expect(saved).toBe(false);
    expect(store.getSnapshot().save.status).toBe('error');
    expect(await store.retrySave()).toBe(false);
    expect(await raw.get(SAVE_KEY)).toEqual(future);
    expect((await raw.keys()).sort()).toEqual([SAVE_KEY]);
  });
});

describe('armazenamento indisponível', () => {
  it('sem IndexedDB e sem localStorage: memória, não persistente', async () => {
    const repo = await createRepository({ indexedDB: undefined, localStorage: undefined });
    expect(repo.kind).toBe('memory');
    expect(repo.persistent).toBe(false);
  });

  it('store avisa e o status de gravação é "error", mas o jogo funciona', async () => {
    const store = new GameStore({
      repository: () => createRepository({ indexedDB: undefined, localStorage: undefined }),
      catalog,
      clock: () => T0,
    });
    await store.init();
    const snap = store.getSnapshot();
    expect(snap).toMatchObject({ ready: true, storage: 'memory', persistent: false, readOnly: false });
    expect(snap.notices.map((n) => n.tone)).toEqual(['warning']);
    expect(snap.notices[0]!.text).toMatch(/não permite salvar dados/);

    const { saved, report } = await playA(store, 'run-1', T0);
    expect(saved).toBe(false);
    expect(report.xp.total).toBe(PERFECT_A);
    expect(store.getSnapshot().save).toMatchObject({ status: 'error', error: 'Progresso só na memória.' });
    expect(store.state.progress.xp).toBe(PERFECT_A);
  });

  it('IndexedDB que falha ao abrir cai para o localStorage', async () => {
    const broken = { open: () => { throw new Error('bloqueado'); } } as unknown as IDBFactory;
    localStorage.clear();
    const repo = await createRepository({ indexedDB: broken, localStorage });
    expect(repo.kind).toBe('localstorage');
    expect(repo.persistent).toBe(true);
    await repo.save(createInitialState(T0), T0);
    expect((await repo.load(T0)).status).toBe('ok');
    localStorage.clear();
  });

  it('fábrica de repositório que rejeita: store sem armazenamento, com aviso', async () => {
    const store = new GameStore({ repository: () => Promise.reject(new Error('nada')), catalog, clock: () => T0 });
    await store.init();
    expect(store.getSnapshot()).toMatchObject({ ready: true, storage: null, persistent: false });
    expect(await store.setProfile({ nickname: 'Zé' })).toBe(false);
    expect(store.getSnapshot().save).toMatchObject({ status: 'error', error: 'Armazenamento indisponível.' });
    expect(store.state.profile.nickname).toBe('Zé');
  });
});

/** Repositório cujas gravações falham enquanto `failing` for true. */
class FlakyRepository implements ProgressRepository {
  readonly kind: StorageKind = 'indexeddb';
  readonly persistent = true;
  failing = true;
  readonly saved: GameState[] = [];
  async load(): Promise<LoadOutcome> {
    return { status: 'empty' };
  }
  async save(state: GameState): Promise<void> {
    if (this.failing) throw new Error('QuotaExceededError: espaço insuficiente');
    this.saved.push(structuredClone(state));
  }
  async snapshot(): Promise<void> {}
  async clear(): Promise<void> {}
  async readCorruptBackups() {
    return [];
  }
}

describe('falha de gravação', () => {
  it('status "error" com a mensagem; estado em memória preservado; retrySave funciona depois', async () => {
    const repo = new FlakyRepository();
    const clock = { now: T0 };
    const store = new GameStore({ repository: async () => repo, catalog, clock: () => clock.now });
    await store.init();

    const { saved, report } = await playA(store, 'run-1', T0);
    expect(saved).toBe(false);
    expect(report.xp.total).toBe(PERFECT_A);
    expect(store.getSnapshot().save).toEqual({ status: 'error', error: 'QuotaExceededError: espaço insuficiente', lastSavedAt: null });
    expect(store.state.progress.xp).toBe(PERFECT_A);
    expect(store.state.progress.processedRuns).toEqual(['run-1']);
    expect(repo.saved).toEqual([]);

    repo.failing = false;
    clock.now = T0 + MINUTE;
    expect(await store.retrySave()).toBe(true);
    expect(store.getSnapshot().save).toEqual({ status: 'saved', error: null, lastSavedAt: T0 + MINUTE });
    expect(repo.saved.at(-1)!.progress.xp).toBe(PERFECT_A);
    expect(repo.saved.at(-1)).toEqual(store.state);
  });

  it('uma falha não bloqueia a fila: a gravação seguinte acontece', async () => {
    const repo = new FlakyRepository();
    const store = new GameStore({ repository: async () => repo, catalog, clock: () => T0 });
    await store.init();
    const first = store.setProfile({ nickname: 'Um' });
    repo.failing = true;
    expect(await first).toBe(false);
    repo.failing = false;
    expect(await store.setProfile({ nickname: 'Dois' })).toBe(true);
    expect(repo.saved.at(-1)!.profile.nickname).toBe('Dois');
  });

  it('repositório em memória (KeyValueRepository) conta como não persistente', async () => {
    const repo = new KeyValueRepository(new MemoryStore());
    expect(repo.persistent).toBe(false);
    await repo.save(createInitialState(T0), T0);
    expect((await repo.load(T0)).status).toBe('ok');
  });
});
