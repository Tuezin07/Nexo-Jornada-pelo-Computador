/**
 * Camada de repositório: a interface não conhece o mecanismo de armazenamento.
 *
 * Ordem de preferência: IndexedDB → localStorage → memória (não persiste; a
 * interface avisa o jogador). Cada gravação substitui o documento inteiro numa
 * única operação, o que mantém XP, registros e conquistas sempre consistentes.
 */
import type { GameState } from '../domain/state';
import { decodeSave, encodeSave, type DecodeResult } from './codec';

export type StorageKind = 'indexeddb' | 'localstorage' | 'memory';

export interface KeyValueStore {
  readonly kind: StorageKind;
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  keys(): Promise<string[]>;
}

export const SAVE_KEY = 'save';
export const PREVIOUS_KEY = 'save:anterior';
export const CORRUPT_PREFIX = 'save:corrompido:';

export type LoadOutcome =
  | { status: 'empty' }
  | { status: 'ok'; state: GameState; issues: string[]; migratedFrom: number | null }
  | { status: 'recovered'; state: GameState | null; message: string; backupKey: string }
  | { status: 'newer'; message: string };

export interface ProgressRepository {
  readonly kind: StorageKind;
  readonly persistent: boolean;
  load(now: number): Promise<LoadOutcome>;
  save(state: GameState, now: number): Promise<void>;
  /** Guarda uma cópia do save atual antes de uma operação arriscada (importação, migração). */
  snapshot(): Promise<void>;
  clear(): Promise<void>;
  readCorruptBackups(): Promise<{ key: string; value: unknown }[]>;
}

export class KeyValueRepository implements ProgressRepository {
  constructor(private readonly store: KeyValueStore) {}

  get kind(): StorageKind {
    return this.store.kind;
  }

  get persistent(): boolean {
    return this.store.kind !== 'memory';
  }

  async load(now: number): Promise<LoadOutcome> {
    let raw: unknown;
    try {
      raw = await this.store.get(SAVE_KEY);
    } catch {
      return { status: 'recovered', state: null, message: 'Não foi possível ler o progresso salvo.', backupKey: '' };
    }
    if (raw === undefined || raw === null) return { status: 'empty' };
    const decoded: DecodeResult = decodeSave(raw, now);
    if (decoded.status === 'ok') {
      if (decoded.migratedFrom !== null) await this.store.set(PREVIOUS_KEY, raw).catch(() => undefined);
      return decoded;
    }
    if (decoded.status === 'newer') return { status: 'newer', message: decoded.message };
    // Dados inválidos: preserva uma cópia antes de qualquer outra coisa e tenta recuperar.
    const backupKey = `${CORRUPT_PREFIX}${now}`;
    await this.store.set(backupKey, raw).catch(() => undefined);
    const inner = typeof raw === 'object' && raw !== null && 'data' in raw ? (raw as { data: unknown }).data : raw;
    const salvage = decodeSave({ app: 'nexo', schemaVersion: 1, savedAt: now, data: inner }, now);
    return {
      status: 'recovered',
      state: salvage.status === 'ok' ? salvage.state : null,
      message: `${decoded.message} Uma cópia dos dados originais foi guardada e o que era válido foi recuperado.`,
      backupKey,
    };
  }

  async save(state: GameState, now: number): Promise<void> {
    await this.store.set(SAVE_KEY, encodeSave(state, now));
  }

  async snapshot(): Promise<void> {
    const current = await this.store.get(SAVE_KEY);
    if (current !== undefined && current !== null) await this.store.set(PREVIOUS_KEY, current);
  }

  async clear(): Promise<void> {
    for (const key of await this.store.keys()) await this.store.delete(key);
  }

  async readCorruptBackups(): Promise<{ key: string; value: unknown }[]> {
    const keys = (await this.store.keys()).filter((k) => k.startsWith(CORRUPT_PREFIX));
    return Promise.all(keys.map(async (key) => ({ key, value: await this.store.get(key) })));
  }
}

export class MemoryStore implements KeyValueStore {
  readonly kind: StorageKind = 'memory';
  private readonly data = new Map<string, unknown>();
  async get(key: string) {
    const value = this.data.get(key);
    return value === undefined ? undefined : structuredClone(value);
  }
  async set(key: string, value: unknown) {
    this.data.set(key, structuredClone(value));
  }
  async delete(key: string) {
    this.data.delete(key);
  }
  async keys() {
    return [...this.data.keys()];
  }
}

const LS_PREFIX = 'nexo:';

export class LocalStorageStore implements KeyValueStore {
  readonly kind: StorageKind = 'localstorage';
  constructor(private readonly storage: Storage) {}
  async get(key: string) {
    const raw = this.storage.getItem(LS_PREFIX + key);
    if (raw === null) return undefined;
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return raw;
    }
  }
  async set(key: string, value: unknown) {
    this.storage.setItem(LS_PREFIX + key, JSON.stringify(value));
  }
  async delete(key: string) {
    this.storage.removeItem(LS_PREFIX + key);
  }
  async keys() {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const k = this.storage.key(i);
      if (k && k.startsWith(LS_PREFIX) && k !== `${LS_PREFIX}boot`) keys.push(k.slice(LS_PREFIX.length));
    }
    return keys;
  }
}

const DB_NAME = 'nexo';
const DB_VERSION = 1;
const STORE = 'kv';

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Falha no IndexedDB'));
  });
}

export class IndexedDbStore implements KeyValueStore {
  readonly kind: StorageKind = 'indexeddb';
  private constructor(private readonly db: IDBDatabase) {}

  static open(factory: IDBFactory, timeoutMs = 4000): Promise<IndexedDbStore> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        settled = true;
        reject(new Error('IndexedDB não respondeu a tempo.'));
      }, timeoutMs);
      let req: IDBOpenDBRequest;
      try {
        req = factory.open(DB_NAME, DB_VERSION);
      } catch (error) {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error('IndexedDB indisponível.'));
        return;
      }
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = () => {
        clearTimeout(timer);
        if (settled) {
          req.result.close();
          return;
        }
        resolve(new IndexedDbStore(req.result));
      };
      req.onerror = () => {
        clearTimeout(timer);
        if (!settled) reject(req.error ?? new Error('IndexedDB indisponível.'));
      };
      req.onblocked = () => {
        clearTimeout(timer);
        if (!settled) reject(new Error('IndexedDB bloqueado por outra aba.'));
      };
    });
  }

  private tx(mode: IDBTransactionMode): IDBObjectStore {
    return this.db.transaction(STORE, mode).objectStore(STORE);
  }

  async get(key: string) {
    return request(this.tx('readonly').get(key));
  }

  /** Só resolve quando a transação é confirmada em disco (evento `complete`). */
  private write(action: (store: IDBObjectStore) => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const tx = this.db.transaction(STORE, 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Falha ao gravar.'));
      tx.onabort = () => reject(tx.error ?? new Error('Gravação cancelada (espaço insuficiente?).'));
      action(tx.objectStore(STORE));
    });
  }

  set(key: string, value: unknown) {
    return this.write((store) => store.put(value, key));
  }

  delete(key: string) {
    return this.write((store) => store.delete(key));
  }

  async keys() {
    const keys = await request(this.tx('readonly').getAllKeys());
    return keys.map(String);
  }
}

export interface RepositoryEnvironment {
  indexedDB?: IDBFactory | undefined;
  localStorage?: Storage | undefined;
}

function safeLocalStorage(): Storage | undefined {
  try {
    const ls = globalThis.localStorage;
    const probe = '__nexo_probe__';
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    return undefined;
  }
}

export async function createRepository(env?: RepositoryEnvironment): Promise<ProgressRepository> {
  const factory = env ? env.indexedDB : globalThis.indexedDB;
  if (factory) {
    try {
      return new KeyValueRepository(await IndexedDbStore.open(factory));
    } catch {
      // segue para o próximo mecanismo
    }
  }
  const ls = env ? env.localStorage : safeLocalStorage();
  if (ls) return new KeyValueRepository(new LocalStorageStore(ls));
  return new KeyValueRepository(new MemoryStore());
}
