/**
 * Sistema de arquivos virtual usado pelo Explorador e pelo Terminal simulados.
 *
 * Estado normalizado e imutável: cada operação devolve um novo estado (ou um erro
 * legível). Nada aqui toca o computador real.
 */
import type { FsSeedNode } from '../../content/types';

export const ROOT_ID = 'root';
export const TRASH_ID = 'trash';

export interface FsItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parent: string;
  sizeKb: number;
  /** Conteúdo de um arquivo .zip. */
  archive?: FsSeedNode[];
}

export interface TrashEntry {
  id: string;
  /** Pasta de onde o item saiu, para restaurar. */
  from: string;
}

export interface FsState {
  items: Record<string, FsItem>;
  trash: TrashEntry[];
  nextId: number;
  opened: string[];
  trashEmptied: boolean;
  protectedIds: string[];
  /** Tentativas de excluir ou mover itens protegidos. */
  violations: number;
}

export type FsResult = { ok: true; state: FsState; created?: string } | { ok: false; error: string; state: FsState };

const INVALID_NAME = /[\\/:*?"<>|]/;

export function normalizeName(name: string): string {
  return name.normalize('NFC').toLocaleLowerCase('pt-BR');
}

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

export function baseName(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
}

function addSeed(state: FsState, seed: FsSeedNode, parent: string): void {
  const id = `n${state.nextId++}`;
  const isZip = seed.type === 'file' && extensionOf(seed.name) === 'zip';
  state.items[id] = {
    id,
    name: seed.name,
    type: seed.type,
    parent,
    sizeKb: seed.type === 'file' ? (seed.sizeKb ?? (isZip ? archiveSize(seed.children ?? []) : 24)) : 0,
    ...(isZip ? { archive: structuredClone(seed.children ?? []) } : {}),
  };
  if (seed.type === 'folder') for (const child of seed.children ?? []) addSeed(state, child, id);
}

function archiveSize(nodes: FsSeedNode[]): number {
  let total = 0;
  for (const n of nodes) total += n.type === 'file' ? (n.sizeKb ?? 24) : archiveSize(n.children ?? []);
  return Math.max(1, Math.round(total * 0.6));
}

export function createFs(root: FsSeedNode[], trash: FsSeedNode[] = [], protectedPaths: string[] = []): FsState {
  const state: FsState = {
    items: { [ROOT_ID]: { id: ROOT_ID, name: '', type: 'folder', parent: '', sizeKb: 0 } },
    trash: [],
    nextId: 1,
    opened: [],
    trashEmptied: false,
    protectedIds: [],
    violations: 0,
  };
  for (const seed of root) addSeed(state, seed, ROOT_ID);
  for (const seed of trash) {
    const before = state.nextId;
    addSeed(state, seed, TRASH_ID);
    state.trash.push({ id: `n${before}`, from: ROOT_ID });
  }
  state.protectedIds = protectedPaths.map((p) => resolvePath(state, p)).filter((id): id is string => id !== null);
  return state;
}

function clone(state: FsState): FsState {
  return {
    ...state,
    items: { ...state.items },
    trash: [...state.trash],
    opened: [...state.opened],
    protectedIds: [...state.protectedIds],
  };
}

export function childrenOf(state: FsState, folderId: string): FsItem[] {
  return Object.values(state.items)
    .filter((item) => item.parent === folderId && item.id !== ROOT_ID)
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name, 'pt-BR') : a.type === 'folder' ? -1 : 1));
}

export function pathOf(state: FsState, id: string): string {
  if (id === ROOT_ID) return '/';
  const parts: string[] = [];
  let current = state.items[id];
  while (current && current.id !== ROOT_ID) {
    parts.unshift(current.name);
    if (current.parent === TRASH_ID) return `Lixeira/${parts.join('/')}`;
    current = state.items[current.parent];
  }
  return `/${parts.join('/')}`;
}

export function splitPath(path: string): string[] {
  return path
    .replace(/\\/g, '/')
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);
}

export function findChild(state: FsState, folderId: string, name: string): FsItem | undefined {
  const wanted = normalizeName(name);
  return childrenOf(state, folderId).find((c) => normalizeName(c.name) === wanted);
}

/** Resolve um caminho absoluto ("/Documentos/a.txt") para o id do item. */
export function resolvePath(state: FsState, path: string): string | null {
  let current = ROOT_ID;
  for (const part of splitPath(path)) {
    const child = findChild(state, current, part);
    if (!child) return null;
    current = child.id;
  }
  return current;
}

export function isInTrash(state: FsState, id: string): boolean {
  let current = state.items[id];
  while (current) {
    if (current.parent === TRASH_ID) return true;
    current = state.items[current.parent];
  }
  return false;
}

export function isDescendant(state: FsState, id: string, ancestorId: string): boolean {
  let current = state.items[id];
  while (current) {
    if (current.id === ancestorId) return true;
    current = state.items[current.parent];
  }
  return false;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'O nome não pode ficar vazio.';
  if (INVALID_NAME.test(trimmed)) return 'Nomes não podem conter \\ / : * ? " < > |';
  if (trimmed === '.' || trimmed === '..') return 'Esse nome é reservado.';
  if (trimmed.length > 80) return 'Nome muito longo.';
  return null;
}

function uniqueName(state: FsState, folderId: string, wanted: string): string {
  if (!findChild(state, folderId, wanted)) return wanted;
  const base = baseName(wanted);
  const ext = extensionOf(wanted);
  for (let i = 2; i < 100; i++) {
    const candidate = ext ? `${base} (${i}).${ext}` : `${wanted} (${i})`;
    if (!findChild(state, folderId, candidate)) return candidate;
  }
  return `${wanted} ${Date.now()}`;
}

function isProtected(state: FsState, ids: string[]): boolean {
  return ids.some((id) => state.protectedIds.some((p) => isDescendant(state, p, id)));
}

function violation(state: FsState, error: string): FsResult {
  const next = clone(state);
  next.violations += 1;
  return { ok: false, error, state: next };
}

export function createFolder(state: FsState, parentId: string, name: string, unique = false): FsResult {
  const nameError = validateName(name);
  if (nameError) return { ok: false, error: nameError, state };
  const parent = state.items[parentId];
  if (!parent || parent.type !== 'folder') return { ok: false, error: 'Pasta de destino inválida.', state };
  let finalName = name.trim();
  if (findChild(state, parentId, finalName)) {
    if (!unique) return { ok: false, error: `Já existe um item chamado "${finalName}" aqui.`, state };
    finalName = uniqueName(state, parentId, finalName);
  }
  const next = clone(state);
  const id = `n${next.nextId++}`;
  next.items[id] = { id, name: finalName, type: 'folder', parent: parentId, sizeKb: 0 };
  return { ok: true, state: next, created: id };
}

export function createFile(state: FsState, parentId: string, name: string, sizeKb = 1): FsResult {
  const nameError = validateName(name);
  if (nameError) return { ok: false, error: nameError, state };
  const existing = findChild(state, parentId, name);
  if (existing) {
    if (existing.type === 'folder') return { ok: false, error: `"${name}" é uma pasta.`, state };
    return { ok: true, state, created: existing.id };
  }
  const next = clone(state);
  const id = `n${next.nextId++}`;
  next.items[id] = { id, name: name.trim(), type: 'file', parent: parentId, sizeKb };
  return { ok: true, state: next, created: id };
}

export function rename(state: FsState, id: string, newName: string): FsResult {
  const item = state.items[id];
  if (!item || id === ROOT_ID) return { ok: false, error: 'Item não encontrado.', state };
  const nameError = validateName(newName);
  if (nameError) return { ok: false, error: nameError, state };
  const trimmed = newName.trim();
  const clash = findChild(state, item.parent, trimmed);
  if (clash && clash.id !== id) return { ok: false, error: `Já existe um item chamado "${trimmed}" aqui.`, state };
  const next = clone(state);
  next.items[id] = { ...item, name: trimmed };
  return { ok: true, state: next };
}

export function move(state: FsState, ids: string[], destId: string): FsResult {
  const dest = state.items[destId];
  if (!dest || dest.type !== 'folder') return { ok: false, error: 'Escolha uma pasta de destino.', state };
  if (isProtected(state, ids)) return violation(state, 'Este item é importante e não deve ser movido daqui.');
  const next = clone(state);
  for (const id of ids) {
    const item = next.items[id];
    if (!item) continue;
    if (item.parent === destId) continue;
    if (item.type === 'folder' && isDescendant(next, destId, id)) {
      return { ok: false, error: 'Não é possível mover uma pasta para dentro dela mesma.', state };
    }
    if (findChild(next, destId, item.name)) {
      return { ok: false, error: `Já existe "${item.name}" na pasta de destino.`, state };
    }
    next.items[id] = { ...item, parent: destId };
  }
  return { ok: true, state: next };
}

function copyInto(state: FsState, id: string, destId: string, name?: string): string {
  const item = state.items[id]!;
  const newId = `n${state.nextId++}`;
  state.items[newId] = { ...item, id: newId, parent: destId, name: name ?? item.name };
  if (item.archive) state.items[newId]!.archive = structuredClone(item.archive);
  if (item.type === 'folder') for (const child of childrenOf(state, id)) copyInto(state, child.id, newId);
  return newId;
}

export function copy(state: FsState, ids: string[], destId: string, newName?: string): FsResult {
  const dest = state.items[destId];
  if (!dest || dest.type !== 'folder') return { ok: false, error: 'Destino inválido.', state };
  const next = clone(state);
  for (const id of ids) {
    const item = next.items[id];
    if (!item) continue;
    if (item.type === 'folder' && isDescendant(next, destId, id)) {
      return { ok: false, error: 'Não é possível copiar uma pasta para dentro dela mesma.', state };
    }
    const wanted = ids.length === 1 && newName ? newName : item.name;
    const existing = findChild(next, destId, wanted);
    if (existing) {
      if (existing.type === 'folder') return { ok: false, error: `"${wanted}" já existe no destino.`, state };
      delete next.items[existing.id];
    }
    copyInto(next, id, destId, wanted);
  }
  return { ok: true, state: next };
}

export function moveToTrash(state: FsState, ids: string[]): FsResult {
  if (isProtected(state, ids)) return violation(state, 'Este arquivo é importante e não deve ser excluído.');
  const next = clone(state);
  for (const id of ids) {
    const item = next.items[id];
    if (!item || id === ROOT_ID || item.parent === TRASH_ID) continue;
    next.trash.push({ id, from: item.parent });
    next.items[id] = { ...item, parent: TRASH_ID };
  }
  return { ok: true, state: next };
}

export function restore(state: FsState, ids: string[]): FsResult {
  const next = clone(state);
  for (const id of ids) {
    const entry = next.trash.find((t) => t.id === id);
    const item = next.items[id];
    if (!entry || !item) continue;
    const target = next.items[entry.from] && !isInTrash(next, entry.from) ? entry.from : ROOT_ID;
    const name = uniqueName(next, target, item.name);
    next.items[id] = { ...item, parent: target, name };
    next.trash = next.trash.filter((t) => t.id !== id);
  }
  return { ok: true, state: next };
}

function removeTree(state: FsState, id: string): void {
  for (const child of childrenOf(state, id)) removeTree(state, child.id);
  delete state.items[id];
}

export function emptyTrash(state: FsState): FsResult {
  const next = clone(state);
  for (const entry of next.trash) removeTree(next, entry.id);
  next.trash = [];
  next.trashEmptied = true;
  return { ok: true, state: next };
}

/** Exclusão definitiva (usada pelo terminal: `rm` não usa a Lixeira). */
export function deletePermanently(state: FsState, ids: string[]): FsResult {
  if (isProtected(state, ids)) return violation(state, 'Este arquivo é importante e não deve ser excluído.');
  const next = clone(state);
  for (const id of ids) if (next.items[id] && id !== ROOT_ID) removeTree(next, id);
  return { ok: true, state: next };
}

export function openFile(state: FsState, id: string): FsResult {
  const item = state.items[id];
  if (!item || item.type !== 'file') return { ok: false, error: 'Selecione um arquivo.', state };
  if (state.opened.includes(id)) return { ok: true, state };
  const next = clone(state);
  next.opened.push(id);
  return { ok: true, state: next };
}

function toSeed(state: FsState, id: string): FsSeedNode {
  const item = state.items[id]!;
  if (item.type === 'folder') {
    return { name: item.name, type: 'folder', children: childrenOf(state, id).map((c) => toSeed(state, c.id)) };
  }
  return {
    name: item.name,
    type: 'file',
    sizeKb: item.sizeKb,
    ...(item.archive ? { children: structuredClone(item.archive) } : {}),
  };
}

export function compress(state: FsState, ids: string[], folderId: string): FsResult {
  const valid = ids.filter((id) => state.items[id] && state.items[id]!.parent === folderId);
  if (valid.length === 0) return { ok: false, error: 'Selecione os itens que deseja compactar.', state };
  const first = state.items[valid[0]!]!;
  const contents = valid.map((id) => toSeed(state, id));
  const name = uniqueName(state, folderId, `${first.type === 'file' ? baseName(first.name) : first.name}.zip`);
  const next = clone(state);
  const id = `n${next.nextId++}`;
  next.items[id] = { id, name, type: 'file', parent: folderId, sizeKb: archiveSize(contents), archive: contents };
  return { ok: true, state: next, created: id };
}

export function extract(state: FsState, zipId: string): FsResult {
  const zip = state.items[zipId];
  if (!zip || !zip.archive) return { ok: false, error: 'Selecione um arquivo .zip.', state };
  const next = clone(state);
  const folderName = uniqueName(next, zip.parent, baseName(zip.name));
  const folderId = `n${next.nextId++}`;
  next.items[folderId] = { id: folderId, name: folderName, type: 'folder', parent: zip.parent, sizeKb: 0 };
  for (const seed of zip.archive) addSeed(next, seed, folderId);
  return { ok: true, state: next, created: folderId };
}

export function search(state: FsState, query: string): FsItem[] {
  const q = normalizeName(query.trim());
  if (!q) return [];
  return Object.values(state.items)
    .filter((item) => item.id !== ROOT_ID && !isInTrash(state, item.id) && normalizeName(item.name).includes(q))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export function trashItems(state: FsState): FsItem[] {
  return state.trash.map((t) => state.items[t.id]).filter((i): i is FsItem => Boolean(i));
}

export function folderSize(state: FsState, id: string): number {
  const item = state.items[id];
  if (!item) return 0;
  if (item.type === 'file') return item.sizeKb;
  return childrenOf(state, id).reduce((sum, c) => sum + folderSize(state, c.id), 0);
}

export function usedSpaceKb(state: FsState): number {
  return Object.values(state.items).reduce((sum, item) => sum + (item.type === 'file' ? item.sizeKb : 0), 0);
}

/** Converte um padrão simples com "*" e "?" em expressão regular (sem diferenciar maiúsculas). */
export function globToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}

export function hasGlob(value: string): boolean {
  return /[*?]/.test(value);
}
