/**
 * Explorador de arquivos simulado ("Explorador — NexoOS").
 *
 * Todo o estado vive no sistema de arquivos virtual (domain/sim/fs.ts); este
 * componente só traduz cliques e teclas em operações e mostra o resultado.
 * Quem decide se a etapa foi cumprida é o motor, via `submit`.
 */
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import type { FilesystemStep } from '../../content/types';
import { fsGoalStatus } from '../../domain/evaluators';
import {
  ROOT_ID,
  baseName,
  childrenOf,
  compress,
  createFolder,
  createFs,
  deletePermanently,
  emptyTrash,
  extensionOf,
  extract,
  isDescendant,
  isInTrash,
  move,
  moveToTrash,
  openFile,
  pathOf,
  rename,
  resolvePath,
  restore,
  search,
  trashItems,
  type FsItem,
  type FsResult,
  type FsState,
} from '../../domain/sim/fs';
import type { Platform } from '../../domain/sim/keys';
import { Dialog } from '../components/common';
import { Icon, type IconName } from '../components/Icon';
import { RichText } from '../components/RichText';
import type { ChallengeProps } from './types';
import './Filesystem.css';

// ---------------------------------------------------------------------------
// Utilitários de exibição
// ---------------------------------------------------------------------------

const NUMBER = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

/** 840 → "840 KB"; 2350 → "2,3 MB"; 4194304 → "4 GB". */
export function formatSize(kb: number): string {
  if (kb < 1024) return `${NUMBER.format(Math.round(kb))} KB`;
  if (kb < 1024 * 1024) return `${NUMBER.format(kb / 1024)} MB`;
  return `${NUMBER.format(kb / (1024 * 1024))} GB`;
}

const TYPE_NAMES: Record<string, string> = {
  pdf: 'Documento PDF',
  doc: 'Documento do Word',
  docx: 'Documento do Word',
  odt: 'Documento de texto (ODT)',
  rtf: 'Documento RTF',
  txt: 'Documento de texto',
  md: 'Documento de texto',
  log: 'Registro de texto',
  xls: 'Planilha',
  xlsx: 'Planilha',
  ods: 'Planilha',
  csv: 'Planilha (CSV)',
  ppt: 'Apresentação',
  pptx: 'Apresentação',
  odp: 'Apresentação',
  jpg: 'Imagem',
  jpeg: 'Imagem',
  png: 'Imagem',
  gif: 'Imagem',
  webp: 'Imagem',
  bmp: 'Imagem',
  heic: 'Imagem',
  svg: 'Imagem vetorial',
  mp3: 'Áudio',
  wav: 'Áudio',
  ogg: 'Áudio',
  m4a: 'Áudio',
  flac: 'Áudio',
  mp4: 'Vídeo',
  mkv: 'Vídeo',
  avi: 'Vídeo',
  mov: 'Vídeo',
  webm: 'Vídeo',
  zip: 'Pasta compactada',
  rar: 'Arquivo compactado',
  '7z': 'Arquivo compactado',
  exe: 'Aplicativo',
  msi: 'Pacote de instalação',
  apk: 'Aplicativo Android',
  bat: 'Script de comandos',
  cmd: 'Script de comandos',
  ps1: 'Script do PowerShell',
  vbs: 'Script',
  js: 'Script',
  scr: 'Proteção de tela (programa)',
  lnk: 'Atalho',
  html: 'Página da web',
  htm: 'Página da web',
  iso: 'Imagem de disco',
  tmp: 'Arquivo temporário',
  ics: 'Evento de calendário',
  eml: 'Mensagem de e-mail',
  json: 'Dados JSON',
  xml: 'Documento XML',
};

const ARCHIVE_EXT = new Set(['zip', 'rar', '7z']);
const APP_EXT = new Set(['exe', 'msi', 'apk', 'bat', 'cmd', 'ps1', 'vbs', 'js', 'scr']);
const AUDIO_EXT = new Set(['mp3', 'wav', 'ogg', 'm4a', 'flac']);
const VIDEO_EXT = new Set(['mp4', 'mkv', 'avi', 'mov', 'webm']);

/** Nome amigável do tipo, como na coluna "Tipo" de um explorador. */
export function friendlyType(item: Pick<FsItem, 'name' | 'type'>): string {
  if (item.type === 'folder') return 'Pasta de arquivos';
  const ext = extensionOf(item.name);
  if (!ext) return 'Arquivo';
  return TYPE_NAMES[ext] ?? `Arquivo ${ext.toUpperCase()}`;
}

type IconKind = 'folder' | 'archive' | 'app' | 'media' | 'file';

function iconFor(item: FsItem): { name: IconName; kind: IconKind } {
  if (item.type === 'folder') return { name: 'folder', kind: 'folder' };
  const ext = extensionOf(item.name);
  if (item.archive || ARCHIVE_EXT.has(ext)) return { name: 'archive', kind: 'archive' };
  if (APP_EXT.has(ext)) return { name: 'window', kind: 'app' };
  if (AUDIO_EXT.has(ext)) return { name: 'volume', kind: 'media' };
  if (VIDEO_EXT.has(ext)) return { name: 'play', kind: 'media' };
  return { name: 'file', kind: 'file' };
}

/** Extensão original com o ponto e a caixa preservada (".PDF", ".zip") ou "". */
function originalExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot) : '';
}

function displayName(item: FsItem, showExtensions: boolean): string {
  return item.type === 'file' && !showExtensions ? baseName(item.name) : item.name;
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

const isItem = (item: FsItem | undefined): item is FsItem => item !== undefined;

function folderLabel(state: FsState, id: string): string {
  return id === ROOT_ID ? 'Este computador' : (state.items[id]?.name ?? 'Este computador');
}

// ---------------------------------------------------------------------------
// Painel de objetivos (compartilhado com Terminal e Configurações)
// ---------------------------------------------------------------------------

export interface SimGoal {
  label: string;
  done: boolean;
}

interface SimGoalsPanelProps {
  goals: SimGoal[];
  locked: boolean;
  onVerify: () => void;
  /** Muda a cada verificação sem sucesso, para sacudir a lista. */
  shake: number;
}

/** Objetivos ao vivo da simulação + botão "Verificar". */
export function SimGoalsPanel({ goals, locked, onVerify, shake }: SimGoalsPanelProps) {
  const id = useId();
  const done = goals.filter((g) => g.done).length;
  return (
    <aside className="goals-panel sim-goals" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>
        <Icon name="target" size={16} /> Objetivos
      </h3>
      <ul key={shake} className={`checklist ${shake ? 'shake' : ''}`}>
        {goals.map((goal, index) => (
          <li key={index} className={goal.done ? 'done' : ''}>
            <Icon name={goal.done ? 'check' : 'target'} size={16} />
            <span>
              <RichText as="inline" text={goal.label} />
              <span className="visually-hidden">{goal.done ? ' (concluído)' : ' (pendente)'}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="sim-goals-count" aria-live="polite">
        {done} de {goals.length} {goals.length === 1 ? 'concluído' : 'concluídos'}
      </p>
      {!locked && (
        <button type="button" className="btn primary sim-goals-verify" onClick={onVerify}>
          <Icon name="check" /> Verificar
        </button>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

type View = { kind: 'folder'; id: string } | { kind: 'trash' };
type Tone = 'info' | 'ok' | 'error';

interface StatusMessage {
  id: number;
  tone: Tone;
  text: string;
}

interface RenameState {
  id: string;
  value: string;
}

type DialogState = null | { kind: 'move'; ids: string[] } | { kind: 'empty-trash' } | { kind: 'delete'; ids: string[] };

type RenameEnd = 'enter' | 'escape' | 'blur';

function setup(step: FilesystemStep): { fs: FsState; folder: string } {
  const fs = createFs(step.root, step.trash, step.protectedPaths);
  const start = resolvePath(fs, step.startPath);
  const folder = start && fs.items[start]?.type === 'folder' ? start : ROOT_ID;
  return { fs, folder };
}

function sameView(a: View, b: View): boolean {
  return a.kind === b.kind && (a.kind === 'trash' || (b.kind === 'folder' && a.id === b.id));
}

export function FilesystemChallenge({ step, locked, submit, platform }: ChallengeProps<'filesystem'>) {
  const features = step.features;
  const uid = useId();
  const [initial] = useState(() => setup(step));
  const [fs, setFs] = useState<FsState>(initial.fs);
  const [view, setView] = useState<View>({ kind: 'folder', id: initial.folder });
  const [backStack, setBackStack] = useState<View[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const anchorRef = useRef<string | null>(null);
  const [query, setQuery] = useState('');
  const [showExt, setShowExt] = useState(!features.extensions);
  const [renaming, setRenamingState] = useState<RenameState | null>(null);
  const renameRef = useRef<RenameState | null>(null);
  const [clipboard, setClipboard] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const statusSeq = useRef(0);
  const [shake, setShake] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const focusGridAfterDialog = useRef(false);

  // --- Estado derivado -------------------------------------------------------
  const inTrash = view.kind === 'trash';
  const folderId = view.kind === 'folder' && fs.items[view.id] && !isInTrash(fs, view.id) ? view.id : ROOT_ID;
  const currentView: View = inTrash ? { kind: 'trash' } : { kind: 'folder', id: folderId };
  const searching = Boolean(features.search) && !inTrash && query.trim() !== '';
  const items = useMemo(
    () => (inTrash ? trashItems(fs) : searching ? search(fs, query) : childrenOf(fs, folderId)),
    [fs, inTrash, searching, query, folderId],
  );
  const itemIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);
  const selection = selected.filter((id) => itemIds.has(id));
  const selectedItems = selection.map((id) => fs.items[id]).filter(isItem);
  const single = selectedItems.length === 1 ? selectedItems[0] : undefined;
  const activeId = active && itemIds.has(active) ? active : null;
  const clip = clipboard.filter((id) => fs.items[id] !== undefined && !isInTrash(fs, id));
  const goalStatus = fsGoalStatus(step, fs);
  const showLocation = inTrash || searching;
  const rowId = (id: string) => `${uid}-row-${id}`;
  const display = (item: FsItem) => displayName(item, showExt);

  // --- Efeitos de foco e rolagem ---------------------------------------------
  useEffect(() => {
    if (!activeId) return;
    const row = document.getElementById(`${uid}-row-${activeId}`);
    if (row && typeof row.scrollIntoView === 'function') row.scrollIntoView({ block: 'nearest' });
  }, [activeId, uid]);

  useEffect(() => {
    if (dialog === null && focusGridAfterDialog.current) {
      focusGridAfterDialog.current = false;
      gridRef.current?.focus();
    }
  }, [dialog]);

  // --- Mensagens -------------------------------------------------------------
  const say = (tone: Tone, text: string) => {
    statusSeq.current += 1;
    setStatus({ id: statusSeq.current, tone, text });
  };

  /** Aplica o resultado de uma operação. Em caso de erro, o estado também é aplicado (conta violações). */
  const apply = (result: FsResult, success: string): boolean => {
    setFs(result.state);
    if (!result.ok) {
      say('error', result.error);
      return false;
    }
    say('ok', success);
    return true;
  };

  const describe = (list: FsItem[]) => (list.length === 1 && list[0] ? `"${display(list[0])}"` : plural(list.length, 'item', 'itens'));

  // --- Seleção ---------------------------------------------------------------
  const resetSelection = (select?: string) => {
    setSelected(select ? [select] : []);
    setActive(select ?? null);
    anchorRef.current = select ?? null;
  };

  const selectOnly = (id: string) => resetSelection(id);

  const toggleSelect = (id: string) => {
    setSelected((current) => {
      const visible = current.filter((x) => itemIds.has(x));
      return visible.includes(id) ? visible.filter((x) => x !== id) : [...visible, id];
    });
    setActive(id);
    anchorRef.current = id;
  };

  const selectRange = (id: string) => {
    const anchor = anchorRef.current && itemIds.has(anchorRef.current) ? anchorRef.current : id;
    const a = items.findIndex((i) => i.id === anchor);
    const b = items.findIndex((i) => i.id === id);
    const [from, to] = a < b ? [a, b] : [b, a];
    setSelected(items.slice(from, to + 1).map((i) => i.id));
    setActive(id);
  };

  const allSelected = items.length > 0 && selection.length === items.length;
  const toggleAll = () => {
    if (locked) return;
    if (allSelected) resetSelection();
    else {
      setSelected(items.map((i) => i.id));
      setActive(activeId ?? items[0]?.id ?? null);
    }
  };

  /** Caixas de seleção: alternam o item e devolvem o foco à lista, onde ficam os atalhos. */
  const fromCheckbox = (action: () => void) => {
    if (locked) return;
    action();
    gridRef.current?.focus();
  };

  // --- Navegação -------------------------------------------------------------
  const setRename = (next: RenameState | null) => {
    renameRef.current = next;
    setRenamingState(next);
  };

  const go = (next: View, select?: string) => {
    if (locked) return;
    setRename(null);
    if (!sameView(next, currentView)) {
      setBackStack((stack) => [...stack, currentView]);
      setView(next);
    }
    setQuery('');
    resetSelection(select);
  };

  const goBack = () => {
    if (locked) return;
    const previous = backStack[backStack.length - 1];
    if (!previous) return;
    setRename(null);
    setBackStack((stack) => stack.slice(0, -1));
    setView(previous);
    setQuery('');
    resetSelection();
  };

  const canGoUp = inTrash || folderId !== ROOT_ID;
  const goUp = () => {
    if (inTrash) go({ kind: 'folder', id: ROOT_ID });
    else if (folderId !== ROOT_ID) {
      const parent = fs.items[folderId]?.parent ?? ROOT_ID;
      go({ kind: 'folder', id: parent }, folderId);
    }
  };

  // --- Ações -----------------------------------------------------------------
  const openItem = (item: FsItem) => {
    if (locked) return;
    if (inTrash) {
      say('info', `"${display(item)}" está na Lixeira. Restaure o item para poder abri-lo.`);
      return;
    }
    if (item.type === 'folder') {
      go({ kind: 'folder', id: item.id });
      return;
    }
    const result = openFile(fs, item.id);
    setFs(result.state);
    if (!result.ok) {
      say('error', result.error);
      return;
    }
    const tip = item.archive && features.compress ? ' Para trabalhar nos arquivos, extraia o conteúdo antes.' : '';
    say('info', `Abrindo ${display(item)}…${tip}`);
  };

  const beginRename = (state: FsState, id: string) => {
    const item = state.items[id];
    if (!item) return;
    const value = item.type === 'file' && !showExt ? baseName(item.name) : item.name;
    setRename({ id, value });
    setSelected([id]);
    setActive(id);
    anchorRef.current = id;
  };

  const finishRename = (end: RenameEnd) => {
    const current = renameRef.current;
    if (!current) return;
    const close = () => {
      setRename(null);
      if (end !== 'blur') gridRef.current?.focus();
    };
    const item = fs.items[current.id];
    if (end === 'escape' || !item) {
      close();
      return;
    }
    const typed = current.value.trim();
    const hiddenExt = item.type === 'file' && !showExt ? originalExtension(item.name) : '';
    let finalName = typed ? `${typed}${hiddenExt}` : '';
    // Perdoa a extensão digitada duas vezes ao renomear com a extensão visível ("x.zip.zip").
    const ext = originalExtension(item.name);
    if (ext && !hiddenExt && finalName.toLowerCase().endsWith(`${ext}${ext}`.toLowerCase())) {
      finalName = finalName.slice(0, -ext.length);
    }
    if (finalName === item.name) {
      close();
      return;
    }
    const result = rename(fs, item.id, finalName);
    setFs(result.state);
    if (!result.ok) {
      say('error', result.error);
      // Com Enter, o campo continua aberto para corrigir o nome.
      if (end !== 'enter') setRename(null);
      return;
    }
    close();
    const renamed = result.state.items[item.id] ?? item;
    say('ok', `Renomeado para "${display(renamed)}".`);
  };

  const renameSelected = () => {
    if (!features.rename || locked || inTrash) return;
    const target = single ?? (activeId ? fs.items[activeId] : undefined);
    if (!target) {
      say('info', 'Selecione um item para renomear.');
      return;
    }
    beginRename(fs, target.id);
  };

  const newFolder = () => {
    if (!features.createFolder || locked || inTrash || searching) return;
    const result = createFolder(fs, folderId, 'Nova pasta', true);
    setFs(result.state);
    if (!result.ok) {
      say('error', result.error);
      return;
    }
    if (result.created) beginRename(result.state, result.created);
    say('info', 'Pasta criada. Digite o nome e tecle Enter para confirmar.');
  };

  const deleteSelected = () => {
    if (!features.delete || locked) return;
    if (inTrash) {
      say('info', 'Na Lixeira, use Restaurar ou Esvaziar Lixeira.');
      return;
    }
    if (selection.length === 0) {
      say('info', 'Selecione o que deseja excluir.');
      return;
    }
    if (!features.trash) {
      setDialog({ kind: 'delete', ids: selection });
      return;
    }
    const verb = selection.length === 1 ? 'foi' : 'foram';
    if (apply(moveToTrash(fs, selection), `${describe(selectedItems)} ${verb} para a Lixeira.`)) resetSelection();
  };

  const confirmDelete = (ids: string[]) => {
    const list = ids.map((id) => fs.items[id]).filter(isItem);
    const text = `${describe(list)} ${list.length === 1 ? 'foi apagado' : 'foram apagados'} definitivamente.`;
    if (apply(deletePermanently(fs, ids), text)) resetSelection();
    focusGridAfterDialog.current = true;
    setDialog(null);
  };

  const restoreSelected = () => {
    if (!features.trash || locked || !inTrash) return;
    if (selection.length === 0) {
      say('info', 'Selecione na Lixeira o que deseja restaurar.');
      return;
    }
    const result = restore(fs, selection);
    const first = result.state.items[selection[0] ?? ''];
    const text =
      selection.length === 1 && first
        ? `"${display(first)}" foi restaurado para ${placeLabel(result.state, first.parent)}.`
        : `${plural(selection.length, 'item foi restaurado', 'itens foram restaurados')} para o local de origem.`;
    if (apply(result, text)) resetSelection();
  };

  const confirmEmptyTrash = () => {
    if (apply(emptyTrash(fs), 'Lixeira esvaziada: os itens foram apagados definitivamente.')) resetSelection();
    focusGridAfterDialog.current = true;
    setDialog(null);
  };

  const cutSelected = () => {
    if (!features.move || locked || inTrash || selection.length === 0) return;
    setClipboard(selection);
    say('info', `${describe(selectedItems)} ${selection.length === 1 ? 'recortado' : 'recortados'}. Abra a pasta de destino e clique em Colar.`);
  };

  const canPaste = Boolean(features.move) && !locked && !inTrash && !searching && clip.length > 0;
  const paste = () => {
    if (!canPaste) return;
    const list = clip.map((id) => fs.items[id]).filter(isItem);
    const text = `${describe(list)} ${list.length === 1 ? 'movido' : 'movidos'} para ${folderLabel(fs, folderId)}.`;
    if (apply(move(fs, clip, folderId), text)) {
      setClipboard([]);
      setSelected(clip);
      setActive(clip[0] ?? null);
    }
  };

  const confirmMove = (ids: string[], destination: string) => {
    const list = ids.map((id) => fs.items[id]).filter(isItem);
    const text = `${describe(list)} ${list.length === 1 ? 'movido' : 'movidos'} para ${folderLabel(fs, destination)}.`;
    if (apply(move(fs, ids, destination), text)) {
      resetSelection();
      setClipboard((c) => c.filter((id) => !ids.includes(id)));
    }
    focusGridAfterDialog.current = true;
    setDialog(null);
  };

  const compressSelected = () => {
    if (!features.compress || locked || inTrash || searching) return;
    const result = compress(fs, selection, folderId);
    setFs(result.state);
    if (!result.ok) {
      say('error', result.error);
      return;
    }
    if (result.created) beginRename(result.state, result.created);
    say('info', `Pasta compactada criada com ${plural(selection.length, 'item', 'itens')}. Digite o nome e tecle Enter.`);
  };

  const extractSelected = () => {
    if (!features.compress || locked || inTrash) return;
    if (!single?.archive) {
      say('info', 'Selecione um arquivo .zip para extrair.');
      return;
    }
    const result = extract(fs, single.id);
    setFs(result.state);
    if (!result.ok) {
      say('error', result.error);
      return;
    }
    const folder = result.created ? result.state.items[result.created] : undefined;
    if (result.created && !searching) resetSelection(result.created);
    say('ok', `Conteúdo extraído para a pasta "${folder?.name ?? baseName(single.name)}".`);
  };

  const closeDialog = useCallback(() => setDialog(null), []);

  const verify = () => {
    if (locked) return;
    const evaluation = submit({ kind: 'filesystem', state: fs });
    if (!evaluation.correct) setShake((n) => n + 1);
  };

  // --- Mouse e teclado na lista ------------------------------------------------
  const onRowClick = (event: ReactMouseEvent, item: FsItem) => {
    if (locked || renameRef.current?.id === item.id) return;
    if (event.shiftKey) selectRange(item.id);
    else if (event.ctrlKey || event.metaKey) toggleSelect(item.id);
    else selectOnly(item.id);
  };

  const onGridKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (locked || renameRef.current || event.target !== event.currentTarget) return;
    const mod = event.ctrlKey || event.metaKey;
    const index = activeId ? items.findIndex((i) => i.id === activeId) : -1;
    const moveTo = (to: number) => {
      const item = items[to];
      if (!item) return;
      if (event.shiftKey) selectRange(item.id);
      else if (mod) setActive(item.id);
      else selectOnly(item.id);
    };
    let handled = true;
    switch (event.key) {
      case 'ArrowDown':
        moveTo(index < 0 ? 0 : Math.min(items.length - 1, index + 1));
        break;
      case 'ArrowUp':
        moveTo(index < 0 ? 0 : Math.max(0, index - 1));
        break;
      case 'Home':
        moveTo(0);
        break;
      case 'End':
        moveTo(items.length - 1);
        break;
      case ' ':
        if (activeId) toggleSelect(activeId);
        else if (items[0]) selectOnly(items[0].id);
        break;
      case 'Enter': {
        const item = (activeId ? fs.items[activeId] : undefined) ?? single;
        if (item) openItem(item);
        break;
      }
      case 'F2':
        renameSelected();
        break;
      case 'Delete':
        deleteSelected();
        break;
      case 'Backspace':
        goUp();
        break;
      case 'Escape':
        if (selection.length > 0) resetSelection();
        else handled = false;
        break;
      default: {
        const key = event.key.toLowerCase();
        if (mod && key === 'a') toggleAll();
        else if (mod && key === 'x' && features.move) cutSelected();
        else if (mod && key === 'v' && features.move) paste();
        else handled = false;
      }
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // --- Trilha de navegação ---------------------------------------------------
  const crumbs: { key: string; label: string; view: View }[] = [{ key: ROOT_ID, label: 'Este computador', view: { kind: 'folder', id: ROOT_ID } }];
  if (inTrash) crumbs.push({ key: 'trash', label: 'Lixeira', view: { kind: 'trash' } });
  else {
    const chain: FsItem[] = [];
    let cursor = fs.items[folderId];
    while (cursor && cursor.id !== ROOT_ID) {
      chain.unshift(cursor);
      cursor = fs.items[cursor.parent];
    }
    for (const folder of chain) crumbs.push({ key: folder.id, label: folder.name, view: { kind: 'folder', id: folder.id } });
  }

  const topFolders = childrenOf(fs, ROOT_ID).filter((i) => i.type === 'folder');
  const trashCount = fs.trash.length;
  const trashSize = trashItems(fs).reduce((sum, item) => sum + sizeOf(fs, item), 0);
  const gridLabel = inTrash
    ? 'Itens na Lixeira'
    : searching
      ? `Resultados da busca por ${query.trim()}`
      : `Conteúdo de ${folderLabel(fs, folderId)}`;
  const emptyText = inTrash
    ? 'A Lixeira está vazia.'
    : searching
      ? `Nenhum item encontrado para "${query.trim()}".`
      : 'Esta pasta está vazia.';
  const countText = [
    plural(items.length, 'item', 'itens'),
    selection.length > 0 ? plural(selection.length, 'selecionado', 'selecionados') : null,
    inTrash && trashCount > 0 ? formatSize(trashSize) : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const titlePath = inTrash ? 'Lixeira' : pathOf(fs, folderId);
  const disabled = locked;

  return (
    <div className="challenge">
      <div className="sim-layout">
        <div className="sim-window fx">
          <div className="sim-titlebar">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Explorador — NexoOS</span>
            <span className="fx-title-path" title={titlePath}>
              {titlePath}
            </span>
          </div>

          <div className="fx-nav">
            <button type="button" className="btn small ghost icon-only" onClick={goBack} disabled={disabled || backStack.length === 0} aria-label="Voltar" title="Voltar">
              <Icon name="arrow-left" size={18} />
            </button>
            <button type="button" className="btn small ghost icon-only" onClick={goUp} disabled={disabled || !canGoUp} aria-label="Subir um nível" title="Subir um nível">
              <Icon name="arrow-up" size={18} />
            </button>
            <nav className="fx-crumbs" aria-label="Local atual">
              <ol>
                {crumbs.map((crumb, i) => {
                  const last = i === crumbs.length - 1 && !searching;
                  return (
                    <li key={crumb.key}>
                      {i > 0 && <Icon name="chevron-right" size={14} className="fx-crumb-sep" />}
                      {last ? (
                        <span className="fx-crumb current" aria-current="location">
                          {crumb.label}
                        </span>
                      ) : (
                        <button type="button" className="fx-crumb" onClick={() => go(crumb.view)} disabled={disabled}>
                          {crumb.label}
                        </button>
                      )}
                    </li>
                  );
                })}
                {searching && (
                  <li>
                    <Icon name="chevron-right" size={14} className="fx-crumb-sep" />
                    <span className="fx-crumb current" aria-current="location">
                      Resultados da busca
                    </span>
                  </li>
                )}
              </ol>
            </nav>
            {features.search && (
              <div className="fx-search">
                <Icon name="search" size={16} />
                <input
                  type="search"
                  className="input"
                  placeholder="Buscar em tudo"
                  aria-label="Buscar arquivos e pastas"
                  value={query}
                  disabled={disabled || inTrash}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    resetSelection();
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Escape' && query) {
                      e.preventDefault();
                      setQuery('');
                    } else if (e.key === 'ArrowDown' && items[0]) {
                      e.preventDefault();
                      selectOnly(items[0].id);
                      gridRef.current?.focus();
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="fx-commands" role="group" aria-label="Ações">
            {inTrash ? (
              <>
                <button type="button" className="btn small" onClick={restoreSelected} disabled={disabled || selection.length === 0}>
                  <Icon name="restore" size={16} /> Restaurar
                </button>
                <button type="button" className="btn small danger" onClick={() => setDialog({ kind: 'empty-trash' })} disabled={disabled || trashCount === 0}>
                  <Icon name="trash" size={16} /> Esvaziar Lixeira
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn small" onClick={() => single && openItem(single)} disabled={disabled || !single}>
                  <Icon name="arrow-right" size={16} /> Abrir
                </button>
                {features.createFolder && (
                  <button type="button" className="btn small" onClick={newFolder} disabled={disabled || searching}>
                    <Icon name="plus" size={16} /> Nova pasta
                  </button>
                )}
                {features.rename && (
                  <button type="button" className="btn small" onClick={renameSelected} disabled={disabled || !single}>
                    <Icon name="edit" size={16} /> Renomear
                  </button>
                )}
                {features.move && (
                  <>
                    <button type="button" className="btn small" onClick={cutSelected} disabled={disabled || selection.length === 0}>
                      <Icon name="scissors" size={16} /> Recortar
                    </button>
                    <button type="button" className="btn small" onClick={paste} disabled={!canPaste}>
                      <Icon name="clipboard" size={16} /> Colar{clip.length > 0 ? ` (${clip.length})` : ''}
                    </button>
                    <button type="button" className="btn small" onClick={() => setDialog({ kind: 'move', ids: selection })} disabled={disabled || selection.length === 0}>
                      <Icon name="folder" size={16} /> Mover para…
                    </button>
                  </>
                )}
                {features.delete && (
                  <button type="button" className="btn small danger" onClick={deleteSelected} disabled={disabled || selection.length === 0}>
                    <Icon name="trash" size={16} /> Excluir
                  </button>
                )}
                {features.compress && (
                  <>
                    <button type="button" className="btn small" onClick={compressSelected} disabled={disabled || searching || selection.length === 0}>
                      <Icon name="archive" size={16} /> Compactar
                    </button>
                    <button type="button" className="btn small" onClick={extractSelected} disabled={disabled || !single?.archive}>
                      <Icon name="download" size={16} /> Extrair tudo
                    </button>
                  </>
                )}
              </>
            )}
            {features.extensions && (
              <label className="switch fx-ext-toggle">
                <input type="checkbox" role="switch" checked={showExt} onChange={(e) => setShowExt(e.target.checked)} disabled={disabled} />
                <span className="track" aria-hidden="true" />
                <span>Mostrar extensões</span>
                <span className="state" aria-hidden="true">
                  {showExt ? 'Ligado' : 'Desligado'}
                </span>
              </label>
            )}
          </div>

          <div className="fx-body">
            <nav className="fx-side" aria-label="Acesso rápido">
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => go({ kind: 'folder', id: ROOT_ID })}
                    aria-current={!inTrash && !searching && folderId === ROOT_ID ? 'location' : undefined}
                    disabled={disabled}
                  >
                    <Icon name="home" size={18} /> Este computador
                  </button>
                </li>
                {topFolders.map((folder) => (
                  <li key={folder.id}>
                    <button
                      type="button"
                      onClick={() => go({ kind: 'folder', id: folder.id })}
                      aria-current={!inTrash && !searching && folderId === folder.id ? 'location' : undefined}
                      disabled={disabled}
                    >
                      <Icon name="folder" size={18} /> {folder.name}
                    </button>
                  </li>
                ))}
                {features.trash && (
                  <>
                    <li className="fx-divider" aria-hidden="true" />
                    <li>
                      <button type="button" onClick={() => go({ kind: 'trash' })} aria-current={inTrash ? 'location' : undefined} disabled={disabled}>
                        <Icon name="trash" size={18} /> Lixeira
                        <span className="fx-side-count">
                          {trashCount}
                          <span className="visually-hidden"> {trashCount === 1 ? 'item' : 'itens'}</span>
                        </span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <div className="fx-main">
              <div
                ref={gridRef}
                role="grid"
                aria-multiselectable="true"
                aria-label={gridLabel}
                aria-rowcount={items.length + 1}
                aria-activedescendant={activeId ? rowId(activeId) : undefined}
                tabIndex={0}
                className={`fx-grid ${showLocation ? 'has-location' : ''}`}
                onKeyDown={onGridKeyDown}
                onClick={(e) => {
                  if (e.target === e.currentTarget && !locked) resetSelection();
                }}
              >
                <div role="row" className="fx-row fx-head" aria-rowindex={1}>
                  <div role="columnheader" className="fx-check">
                    <label className="fx-check-hit" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        tabIndex={-1}
                        aria-label="Selecionar tudo"
                        checked={allSelected}
                        onChange={() => fromCheckbox(toggleAll)}
                        disabled={disabled || items.length === 0}
                      />
                    </label>
                  </div>
                  <div role="columnheader">Nome</div>
                  {showLocation && <div role="columnheader">{inTrash ? 'Local original' : 'Local'}</div>}
                  <div role="columnheader">Tipo</div>
                  <div role="columnheader" className="fx-size">
                    Tamanho
                  </div>
                </div>

                {items.length === 0 ? (
                  <div role="row" className="fx-empty" aria-rowindex={2}>
                    <div role="gridcell">{emptyText}</div>
                  </div>
                ) : (
                  items.map((item, index) => (
                    <FileRow
                      key={item.id}
                      id={rowId(item.id)}
                      rowIndex={index + 2}
                      item={item}
                      name={display(item)}
                      type={friendlyType(item)}
                      size={item.type === 'folder' ? plural(childrenOf(fs, item.id).length, 'item', 'itens') : formatSize(item.sizeKb)}
                      location={showLocation ? locationOf(fs, item) : null}
                      selected={selection.includes(item.id)}
                      active={item.id === activeId}
                      cut={clip.includes(item.id)}
                      locked={locked}
                      renaming={renaming?.id === item.id ? renaming.value : null}
                      selectBase={showExt}
                      onClick={(e) => onRowClick(e, item)}
                      onOpen={() => openItem(item)}
                      onToggle={() => fromCheckbox(() => toggleSelect(item.id))}
                      onRenameChange={(value) => setRename({ id: item.id, value })}
                      onRenameEnd={finishRename}
                    />
                  ))
                )}
              </div>
              <ListHelp platform={platform} canRename={Boolean(features.rename)} canDelete={Boolean(features.delete)} />
            </div>
          </div>

          <div className={`sim-status fx-status ${status?.tone === 'error' ? 'error' : status?.tone === 'ok' ? 'ok' : ''}`}>
            <span className="fx-status-msg" role="status">
              {status && (
                <span key={status.id}>
                  <Icon name={status.tone === 'error' ? 'alert' : status.tone === 'ok' ? 'check' : 'info'} size={14} />{' '}
                  {status.tone === 'error' && <span className="visually-hidden">Erro: </span>}
                  {status.text}
                </span>
              )}
            </span>
            <span className="fx-status-count">{countText}</span>
          </div>
        </div>

        <SimGoalsPanel
          goals={step.goals.map((goal, i) => ({ label: goal.label, done: Boolean(goalStatus[i]) }))}
          locked={locked}
          onVerify={verify}
          shake={shake}
        />
      </div>

      {dialog?.kind === 'move' && (
        <MoveDialog fs={fs} ids={dialog.ids} onCancel={closeDialog} onConfirm={(dest) => confirmMove(dialog.ids, dest)} />
      )}
      {dialog?.kind === 'empty-trash' && (
        <Dialog
          title="Esvaziar a Lixeira?"
          onClose={closeDialog}
          actions={
            <>
              <button type="button" className="btn ghost" onClick={closeDialog}>
                Cancelar
              </button>
              <button type="button" className="btn danger" onClick={confirmEmptyTrash}>
                <Icon name="trash" size={18} /> Esvaziar Lixeira
              </button>
            </>
          }
        >
          <p className="muted">
            {plural(trashCount, 'item será apagado', 'itens serão apagados')} definitivamente ({formatSize(trashSize)}). Depois disso, não há como
            restaurar.
          </p>
        </Dialog>
      )}
      {dialog?.kind === 'delete' && (
        <Dialog
          title="Excluir definitivamente?"
          onClose={closeDialog}
          actions={
            <>
              <button type="button" className="btn ghost" onClick={closeDialog}>
                Cancelar
              </button>
              <button type="button" className="btn danger" onClick={() => confirmDelete(dialog.ids)}>
                <Icon name="trash" size={18} /> Excluir
              </button>
            </>
          }
        >
          <p className="muted">
            {describe(dialog.ids.map((id) => fs.items[id]).filter(isItem))} não {dialog.ids.length === 1 ? 'vai' : 'vão'} para a Lixeira: a exclusão não
            pode ser desfeita.
          </p>
        </Dialog>
      )}
    </div>
  );
}

function sizeOf(fs: FsState, item: FsItem): number {
  if (item.type === 'file') return item.sizeKb;
  return childrenOf(fs, item.id).reduce((sum, child) => sum + sizeOf(fs, child), 0);
}

/** Caminho de uma pasta para exibição; a raiz aparece como "Este computador". */
function placeLabel(fs: FsState, folderId: string): string {
  return folderId === ROOT_ID ? 'Este computador' : pathOf(fs, folderId);
}

function locationOf(fs: FsState, item: FsItem): string {
  if (isInTrash(fs, item.id)) {
    const entry = fs.trash.find((t) => t.id === item.id);
    return placeLabel(fs, entry?.from ?? ROOT_ID);
  }
  return placeLabel(fs, item.parent);
}

// ---------------------------------------------------------------------------
// Linha da lista
// ---------------------------------------------------------------------------

interface FileRowProps {
  id: string;
  rowIndex: number;
  item: FsItem;
  name: string;
  type: string;
  size: string;
  location: string | null;
  selected: boolean;
  active: boolean;
  cut: boolean;
  locked: boolean;
  renaming: string | null;
  selectBase: boolean;
  onClick: (event: ReactMouseEvent) => void;
  onOpen: () => void;
  onToggle: () => void;
  onRenameChange: (value: string) => void;
  onRenameEnd: (end: RenameEnd) => void;
}

function FileRow(props: FileRowProps) {
  const { item, name, type, size, location, selected, active, cut, locked, renaming } = props;
  const icon = iconFor(item);
  const classes = ['fx-row', 'fx-item', active ? 'is-active' : '', cut ? 'is-cut' : ''].filter(Boolean).join(' ');
  const label = [name, type, location ? `em ${location}` : null, size, cut ? 'recortado' : null].filter(Boolean).join(', ');
  return (
    <div
      role="row"
      id={props.id}
      aria-rowindex={props.rowIndex}
      aria-selected={selected}
      aria-label={label}
      className={classes}
      onClick={props.onClick}
      onDoubleClick={() => renaming === null && props.onOpen()}
    >
      <div role="gridcell" className="fx-check">
        <label className="fx-check-hit" onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
          <input type="checkbox" tabIndex={-1} aria-label={`Selecionar ${name}`} checked={selected} onChange={props.onToggle} disabled={locked} />
        </label>
      </div>
      <div role="gridcell" className="fx-name">
        <Icon name={icon.name} size={18} className={`fx-icon kind-${icon.kind}`} />
        {renaming !== null ? (
          <RenameField
            value={renaming}
            selectBase={props.selectBase && item.type === 'file'}
            onChange={props.onRenameChange}
            onEnd={props.onRenameEnd}
          />
        ) : (
          <span className="fx-label">{name}</span>
        )}
        {cut && <span className="fx-tag">recortado</span>}
      </div>
      {location !== null && (
        <div role="gridcell" className="fx-loc">
          {location}
        </div>
      )}
      <div role="gridcell" className="fx-type">
        {type}
      </div>
      <div role="gridcell" className="fx-size">
        {size}
      </div>
    </div>
  );
}

interface RenameFieldProps {
  value: string;
  /** Seleciona só o nome-base (sem a extensão), como nos exploradores reais. */
  selectBase: boolean;
  onChange: (value: string) => void;
  onEnd: (end: RenameEnd) => void;
}

function RenameField({ value, selectBase, onChange, onEnd }: RenameFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const selectBaseOnMount = useRef(selectBase);
  useEffect(() => {
    const input = ref.current;
    if (!input) return;
    input.focus();
    const dot = selectBaseOnMount.current ? input.value.lastIndexOf('.') : -1;
    input.setSelectionRange(0, dot > 0 ? dot : input.value.length);
  }, []);
  return (
    <input
      ref={ref}
      className="input fx-rename"
      value={value}
      aria-label="Novo nome"
      autoComplete="off"
      spellCheck={false}
      autoCapitalize="off"
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          onEnd('enter');
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onEnd('escape');
        }
      }}
      onBlur={() => onEnd('blur')}
    />
  );
}

function ListHelp({ platform, canRename, canDelete }: { platform: Platform; canRename: boolean; canDelete: boolean }) {
  const mod = platform === 'mac' ? '⌘' : 'Ctrl';
  return (
    <p className="fx-help">
      <span>
        <kbd>{mod}</kbd>+clique ou a caixa de seleção marcam vários
      </span>
      <span>
        Duplo clique ou <kbd>Enter</kbd> abre
      </span>
      {canRename && (
        <span>
          <kbd>F2</kbd> renomeia
        </span>
      )}
      {canDelete && (
        <span>
          <kbd>Delete</kbd> exclui
        </span>
      )}
      <span>
        <kbd>Backspace</kbd> sobe
      </span>
    </p>
  );
}

// ---------------------------------------------------------------------------
// Diálogo "Mover para…"
// ---------------------------------------------------------------------------

interface FolderNode {
  id: string;
  name: string;
  depth: number;
}

function folderTree(fs: FsState): FolderNode[] {
  const out: FolderNode[] = [{ id: ROOT_ID, name: 'Este computador', depth: 0 }];
  const walk = (parent: string, depth: number) => {
    for (const child of childrenOf(fs, parent)) {
      if (child.type !== 'folder') continue;
      out.push({ id: child.id, name: child.name, depth });
      walk(child.id, depth + 1);
    }
  };
  walk(ROOT_ID, 1);
  return out;
}

interface MoveDialogProps {
  fs: FsState;
  ids: string[];
  onCancel: () => void;
  onConfirm: (destination: string) => void;
}

function MoveDialog({ fs, ids, onCancel, onConfirm }: MoveDialogProps) {
  const name = useId();
  const [destination, setDestination] = useState<string | null>(null);
  const folders = useMemo(() => folderTree(fs), [fs]);
  const isBlocked = (folderId: string) => ids.some((id) => fs.items[id]?.type === 'folder' && isDescendant(fs, folderId, id));
  const isCurrent = (folderId: string) => ids.every((id) => fs.items[id]?.parent === folderId);
  const count = plural(ids.length, 'item', 'itens');
  return (
    <Dialog
      title="Mover para…"
      onClose={onCancel}
      actions={
        <>
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn primary" onClick={() => destination && onConfirm(destination)} disabled={!destination}>
            <Icon name="check" size={18} /> Mover aqui
          </button>
        </>
      }
    >
      <fieldset className="fx-tree">
        <legend className="muted">Escolha a pasta de destino para {count}.</legend>
        {folders.map((folder) => {
          const blocked = isBlocked(folder.id);
          const current = isCurrent(folder.id);
          return (
            <label key={folder.id} className="fx-tree-item" style={{ '--depth': folder.depth } as CSSProperties}>
              <input
                type="radio"
                name={name}
                value={folder.id}
                checked={destination === folder.id}
                onChange={() => setDestination(folder.id)}
                disabled={blocked || current}
              />
              <Icon name={folder.id === ROOT_ID ? 'home' : 'folder'} size={18} />
              <span>{folder.name}</span>
              {current && <span className="faint fx-tree-note">(local atual)</span>}
              {blocked && !current && <span className="faint fx-tree-note">(item sendo movido)</span>}
            </label>
          );
        })}
      </fieldset>
    </Dialog>
  );
}
