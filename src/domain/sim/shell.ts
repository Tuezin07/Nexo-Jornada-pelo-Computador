/**
 * NexoShell: interpretador de comandos simulado sobre o sistema de arquivos virtual.
 * Aceita nomes no estilo Linux/macOS e Windows. Nenhum comando sai do jogo.
 */
import {
  ROOT_ID,
  childrenOf,
  copy,
  createFile,
  createFolder,
  deletePermanently,
  findChild,
  globToRegExp,
  hasGlob,
  move,
  pathOf,
  rename,
  splitPath,
  type FsItem,
  type FsState,
} from './fs';

export type OutputTone = 'normal' | 'error' | 'success' | 'muted' | 'folder' | 'command';

export interface OutputLine {
  text: string;
  tone: OutputTone;
}

export interface CommandRecord {
  command: string;
  args: string[];
  ok: boolean;
}

export interface NetworkConditions {
  online: boolean;
  dnsWorking: boolean;
}

export interface ShellState {
  fs: FsState;
  cwd: string;
  history: CommandRecord[];
  network: NetworkConditions;
}

export interface ShellResult {
  state: ShellState;
  output: OutputLine[];
  clear?: boolean;
}

const ALIASES: Record<string, string> = {
  dir: 'ls',
  type: 'cat',
  copy: 'cp',
  move: 'mv',
  del: 'rm',
  erase: 'rm',
  cls: 'clear',
  md: 'mkdir',
  rd: 'rmdir',
  chdir: 'cd',
};

export const COMMAND_HELP: { name: string; usage: string; description: string }[] = [
  { name: 'help', usage: 'help', description: 'Mostra esta lista.' },
  { name: 'pwd', usage: 'pwd', description: 'Mostra a pasta atual.' },
  { name: 'ls', usage: 'ls  (ou dir)', description: 'Lista o conteúdo da pasta atual.' },
  { name: 'cd', usage: 'cd <pasta> | cd .. | cd /', description: 'Entra em uma pasta, sobe um nível ou volta à raiz.' },
  { name: 'mkdir', usage: 'mkdir <nome>', description: 'Cria uma pasta.' },
  { name: 'cat', usage: 'cat <arquivo>  (ou type)', description: 'Mostra o conteúdo de um arquivo de texto.' },
  { name: 'echo', usage: 'echo <texto> [> arquivo]', description: 'Exibe um texto ou grava em um arquivo.' },
  { name: 'cp', usage: 'cp <origem> <destino>  (ou copy)', description: 'Copia arquivos.' },
  { name: 'mv', usage: 'mv <origem> <destino>  (ou move)', description: 'Move ou renomeia arquivos.' },
  { name: 'rm', usage: 'rm <arquivo>  (ou del)', description: 'Apaga arquivos DEFINITIVAMENTE (sem Lixeira).' },
  { name: 'rmdir', usage: 'rmdir <pasta>', description: 'Remove uma pasta vazia.' },
  { name: 'tree', usage: 'tree', description: 'Mostra a árvore de pastas a partir daqui.' },
  { name: 'clear', usage: 'clear  (ou cls)', description: 'Limpa a tela.' },
  { name: 'whoami', usage: 'whoami', description: 'Mostra o usuário atual.' },
  { name: 'date', usage: 'date', description: 'Mostra data e hora.' },
  { name: 'ping', usage: 'ping <endereço>', description: 'Testa se um endereço responde na rede.' },
  { name: 'ipconfig', usage: 'ipconfig', description: 'Mostra a configuração de rede.' },
  { name: 'nslookup', usage: 'nslookup <nome>', description: 'Consulta o DNS: descobre o IP de um nome.' },
];

export function createShell(fs: FsState, cwdPath: string, network?: { online?: boolean; dnsWorking?: boolean }): ShellState {
  let cwd = ROOT_ID;
  for (const part of splitPath(cwdPath)) {
    const child = findChild(fs, cwd, part);
    if (!child || child.type !== 'folder') break;
    cwd = child.id;
  }
  return {
    fs,
    cwd,
    history: [],
    network: { online: network?.online ?? true, dnsWorking: network?.dnsWorking ?? true },
  };
}

/** Divide a linha em argumentos, respeitando aspas simples e duplas. */
export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let hasToken = false;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      hasToken = true;
    } else if (/\s/.test(ch)) {
      if (hasToken) tokens.push(current);
      current = '';
      hasToken = false;
    } else if (ch === '>') {
      if (hasToken) tokens.push(current);
      current = '';
      hasToken = false;
      if (tokens[tokens.length - 1] === '>') tokens[tokens.length - 1] = '>>';
      else tokens.push('>');
    } else {
      current += ch;
      hasToken = true;
    }
  }
  if (hasToken) tokens.push(current);
  return tokens;
}

export function promptPath(state: ShellState): string {
  return pathOf(state.fs, state.cwd);
}

interface Resolved {
  parent: string;
  item: FsItem | null;
  name: string;
}

/** Resolve um caminho relativo ou absoluto. `item` é null se o último trecho não existe. */
function resolveArg(state: ShellState, arg: string): Resolved | null {
  const normalized = arg.replace(/\\/g, '/');
  const absolute = normalized.startsWith('/') || normalized.startsWith('~');
  const parts = splitPath(normalized.replace(/^~/, ''));
  let current = absolute ? ROOT_ID : state.cwd;
  if (parts.length === 0) {
    const item = state.fs.items[current] ?? null;
    return { parent: item?.parent || ROOT_ID, item, name: item?.name ?? '' };
  }
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    const last = i === parts.length - 1;
    let next: FsItem | null = null;
    if (part === '.') next = state.fs.items[current] ?? null;
    else if (part === '..') next = current === ROOT_ID ? state.fs.items[ROOT_ID]! : (state.fs.items[state.fs.items[current]!.parent] ?? null);
    else next = findChild(state.fs, current, part) ?? null;
    if (last) return { parent: current, item: next, name: part };
    if (!next || next.type !== 'folder') return null;
    current = next.id;
  }
  return null;
}

function expandGlob(state: ShellState, arg: string): FsItem[] {
  const normalized = arg.replace(/\\/g, '/');
  const slash = normalized.lastIndexOf('/');
  const dirPart = slash >= 0 ? normalized.slice(0, slash) || '/' : '.';
  const pattern = slash >= 0 ? normalized.slice(slash + 1) : normalized;
  const dir = resolveArg(state, dirPart);
  if (!dir?.item || dir.item.type !== 'folder') return [];
  const regex = globToRegExp(pattern);
  return childrenOf(state.fs, dir.item.id).filter((c) => regex.test(c.name));
}

const line = (text: string, tone: OutputTone = 'normal'): OutputLine => ({ text, tone });

function fakeIp(host: string): string {
  let hash = 0;
  for (const ch of host.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return `203.0.113.${(hash % 200) + 20}`;
}

const IP_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;

function treeLines(state: ShellState, folderId: string, prefix: string, out: OutputLine[]): void {
  const children = childrenOf(state.fs, folderId);
  children.forEach((child, index) => {
    const last = index === children.length - 1;
    out.push(line(`${prefix}${last ? '└── ' : '├── '}${child.name}`, child.type === 'folder' ? 'folder' : 'normal'));
    if (child.type === 'folder') treeLines(state, child.id, `${prefix}${last ? '    ' : '│   '}`, out);
  });
}

type Handler = (state: ShellState, args: string[]) => { state: ShellState; output: OutputLine[]; ok: boolean; clear?: boolean };

const fail = (state: ShellState, message: string) => ({ state, output: [line(message, 'error')], ok: false });

const HANDLERS: Record<string, Handler> = {
  help: (state) => ({
    state,
    ok: true,
    output: [
      line('Comandos disponíveis no NexoShell (ambiente simulado e seguro):', 'muted'),
      ...COMMAND_HELP.map((c) => line(`  ${c.usage.padEnd(36)} ${c.description}`)),
    ],
  }),
  pwd: (state) => ({ state, ok: true, output: [line(promptPath(state))] }),
  ls: (state, args) => {
    let items: FsItem[];
    if (args[0] && hasGlob(args[0])) items = expandGlob(state, args[0]);
    else if (args[0]) {
      const target = resolveArg(state, args[0]);
      if (!target?.item) return fail(state, `ls: "${args[0]}" não encontrado.`);
      items = target.item.type === 'folder' ? childrenOf(state.fs, target.item.id) : [target.item];
    } else items = childrenOf(state.fs, state.cwd);
    if (items.length === 0) return { state, ok: true, output: [line('(pasta vazia)', 'muted')] };
    return {
      state,
      ok: true,
      output: items.map((i) => (i.type === 'folder' ? line(`${i.name}/`, 'folder') : line(`${i.name}  ${i.sizeKb} KB`))),
    };
  },
  cd: (state, args) => {
    if (!args[0] || args[0] === '/' || args[0] === '~') return { state: { ...state, cwd: ROOT_ID }, ok: true, output: [] };
    const target = resolveArg(state, args[0]);
    if (!target?.item) return fail(state, `cd: a pasta "${args[0]}" não existe aqui. Use ls para ver o que há na pasta atual.`);
    if (target.item.type !== 'folder') return fail(state, `cd: "${args[0]}" é um arquivo, não uma pasta.`);
    return { state: { ...state, cwd: target.item.id }, ok: true, output: [] };
  },
  mkdir: (state, args) => {
    if (args.length === 0) return fail(state, 'mkdir: informe o nome da pasta. Exemplo: mkdir Relatorios');
    let fs = state.fs;
    const output: OutputLine[] = [];
    for (const arg of args) {
      const target = resolveArg({ ...state, fs }, arg);
      if (!target) return fail(state, `mkdir: caminho inválido "${arg}".`);
      if (target.item) return fail(state, `mkdir: "${arg}" já existe.`);
      const result = createFolder(fs, target.parent, target.name);
      if (!result.ok) return fail(state, `mkdir: ${result.error}`);
      fs = result.state;
      output.push(line(`Pasta criada: ${target.name}`, 'success'));
    }
    return { state: { ...state, fs }, ok: true, output };
  },
  cat: (state, args) => {
    if (!args[0]) return fail(state, 'cat: informe o arquivo. Exemplo: cat notas.txt');
    const target = resolveArg(state, args[0]);
    if (!target?.item) return fail(state, `cat: "${args[0]}" não encontrado.`);
    if (target.item.type === 'folder') return fail(state, `cat: "${args[0]}" é uma pasta.`);
    return {
      state,
      ok: true,
      output: [line(`[conteúdo de ${target.item.name} — ${target.item.sizeKb} KB]`, 'muted')],
    };
  },
  echo: (state, args) => {
    const redirect = args.findIndex((a) => a === '>' || a === '>>');
    if (redirect === -1) return { state, ok: true, output: [line(args.join(' '))] };
    const fileArg = args[redirect + 1];
    if (!fileArg) return fail(state, 'echo: informe o arquivo depois de ">".');
    const target = resolveArg(state, fileArg);
    if (!target) return fail(state, `echo: caminho inválido "${fileArg}".`);
    if (target.item?.type === 'folder') return fail(state, `echo: "${fileArg}" é uma pasta.`);
    const result = createFile(state.fs, target.parent, target.name, 1);
    if (!result.ok) return fail(state, `echo: ${result.error}`);
    return { state: { ...state, fs: result.state }, ok: true, output: [line(`Texto gravado em ${target.name}`, 'success')] };
  },
  cp: (state, args) => transfer(state, args, 'cp'),
  mv: (state, args) => transfer(state, args, 'mv'),
  rm: (state, args) => {
    if (args.length === 0) return fail(state, 'rm: informe o arquivo. Atenção: rm apaga sem passar pela Lixeira.');
    const targets: FsItem[] = [];
    for (const arg of args) {
      if (arg.startsWith('-')) return fail(state, `rm: a opção "${arg}" está desativada neste ambiente de treino.`);
      if (hasGlob(arg)) targets.push(...expandGlob(state, arg).filter((i) => i.type === 'file'));
      else {
        const target = resolveArg(state, arg);
        if (!target?.item) return fail(state, `rm: "${arg}" não encontrado.`);
        if (target.item.type === 'folder') return fail(state, `rm: "${arg}" é uma pasta. Para pastas vazias use rmdir.`);
        targets.push(target.item);
      }
    }
    if (targets.length === 0) return fail(state, 'rm: nenhum arquivo corresponde ao padrão.');
    const result = deletePermanently(state.fs, targets.map((t) => t.id));
    if (!result.ok) return { state: { ...state, fs: result.state }, ok: false, output: [line(`rm: ${result.error}`, 'error')] };
    return {
      state: { ...state, fs: result.state },
      ok: true,
      output: [line(`${targets.length} arquivo(s) apagado(s) definitivamente.`, 'success')],
    };
  },
  rmdir: (state, args) => {
    if (!args[0]) return fail(state, 'rmdir: informe a pasta.');
    const target = resolveArg(state, args[0]);
    if (!target?.item || target.item.type !== 'folder') return fail(state, `rmdir: a pasta "${args[0]}" não existe.`);
    if (target.item.id === ROOT_ID) return fail(state, 'rmdir: não é possível remover a raiz.');
    if (childrenOf(state.fs, target.item.id).length > 0) return fail(state, `rmdir: a pasta "${args[0]}" não está vazia.`);
    if (state.cwd === target.item.id) return fail(state, 'rmdir: saia da pasta antes de removê-la (cd ..).');
    const result = deletePermanently(state.fs, [target.item.id]);
    if (!result.ok) return { state: { ...state, fs: result.state }, ok: false, output: [line(`rmdir: ${result.error}`, 'error')] };
    return { state: { ...state, fs: result.state }, ok: true, output: [line('Pasta removida.', 'success')] };
  },
  tree: (state) => {
    const out: OutputLine[] = [line(promptPath(state), 'folder')];
    treeLines(state, state.cwd, '', out);
    return { state, ok: true, output: out };
  },
  clear: (state) => ({ state, ok: true, output: [], clear: true }),
  whoami: (state) => ({ state, ok: true, output: [line('nexo\\agente')] }),
  date: (state) => ({
    state,
    ok: true,
    output: [line(new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' }))],
  }),
  ping: (state, args) => {
    const host = args.find((a) => !a.startsWith('-'));
    if (!host) return fail(state, 'ping: informe um endereço. Exemplo: ping exemplo.com');
    const local = host === 'localhost' || host === '127.0.0.1';
    if (!local && !state.network.online) {
      return fail(state, `ping: falha na transmissão. A rede está inacessível (sem conexão).`);
    }
    let ip = host;
    if (!IP_PATTERN.test(host) && !local) {
      if (!state.network.dnsWorking) {
        return fail(state, `ping: não foi possível encontrar o host "${host}". Verifique o nome e o DNS.`);
      }
      ip = fakeIp(host);
    }
    if (local) ip = '127.0.0.1';
    const times = [18, 21, 19, 20].map((t) => (local ? 1 : t));
    return {
      state,
      ok: true,
      output: [
        line(`Disparando ${host} [${ip}] com 32 bytes de dados:`),
        ...times.map((t) => line(`Resposta de ${ip}: bytes=32 tempo=${t}ms TTL=117`)),
        line(`Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de perda)`, 'success'),
      ],
    };
  },
  ipconfig: (state) => {
    if (!state.network.online) {
      return {
        state,
        ok: true,
        output: [line('Adaptador de Rede sem Fio Wi-Fi:'), line('   Estado da mídia. . . . . . . : Mídia desconectada', 'error')],
      };
    }
    return {
      state,
      ok: true,
      output: [
        line('Adaptador de Rede sem Fio Wi-Fi:'),
        line('   Endereço IPv4. . . . . . . . : 192.168.0.23'),
        line('   Máscara de Sub-rede. . . . . : 255.255.255.0'),
        line('   Gateway Padrão . . . . . . . : 192.168.0.1'),
        line('   Servidores DNS . . . . . . . : 192.168.0.1'),
      ],
    };
  },
  nslookup: (state, args) => {
    const host = args[0];
    if (!host) return fail(state, 'nslookup: informe um nome. Exemplo: nslookup exemplo.com');
    if (!state.network.online) return fail(state, 'nslookup: sem conexão com a rede.');
    if (!state.network.dnsWorking) return fail(state, `nslookup: o servidor DNS 192.168.0.1 não respondeu ao pedir "${host}".`);
    return {
      state,
      ok: true,
      output: [line('Servidor:  192.168.0.1'), line(`Nome:      ${host}`), line(`Address:   ${IP_PATTERN.test(host) ? host : fakeIp(host)}`, 'success')],
    };
  },
};

function transfer(state: ShellState, args: string[], mode: 'cp' | 'mv') {
  const clean = args.filter((a) => !a.startsWith('-'));
  if (clean.length < 2) return fail(state, `${mode}: use ${mode} <origem> <destino>.`);
  const destArg = clean[clean.length - 1]!;
  const sources: FsItem[] = [];
  for (const arg of clean.slice(0, -1)) {
    if (hasGlob(arg)) sources.push(...expandGlob(state, arg));
    else {
      const resolved = resolveArg(state, arg);
      if (!resolved?.item) return fail(state, `${mode}: "${arg}" não encontrado.`);
      sources.push(resolved.item);
    }
  }
  if (sources.length === 0) return fail(state, `${mode}: nenhum arquivo corresponde ao padrão.`);
  const dest = resolveArg(state, destArg);
  if (!dest) return fail(state, `${mode}: destino inválido "${destArg}".`);
  const ids = sources.map((s) => s.id);

  if (dest.item?.type === 'folder') {
    const result = mode === 'cp' ? copy(state.fs, ids, dest.item.id) : move(state.fs, ids, dest.item.id);
    if (!result.ok) return { state: { ...state, fs: result.state }, ok: false, output: [line(`${mode}: ${result.error}`, 'error')] };
    const verb = mode === 'cp' ? 'copiado(s)' : 'movido(s)';
    return { state: { ...state, fs: result.state }, ok: true, output: [line(`${sources.length} item(ns) ${verb} para ${dest.item.name}.`, 'success')] };
  }
  if (sources.length > 1) return fail(state, `${mode}: para vários arquivos, o destino precisa ser uma pasta existente.`);
  // Destino não é pasta: copiar/renomear para o novo nome dentro da pasta indicada.
  const source = sources[0]!;
  let fs = state.fs;
  if (mode === 'cp') {
    const result = copy(fs, [source.id], dest.parent, dest.name);
    if (!result.ok) return fail(state, `cp: ${result.error}`);
    fs = result.state;
  } else {
    if (dest.item) return fail(state, `mv: "${destArg}" já existe.`);
    if (source.parent !== dest.parent) {
      const moved = move(fs, [source.id], dest.parent);
      if (!moved.ok) return { state: { ...state, fs: moved.state }, ok: false, output: [line(`mv: ${moved.error}`, 'error')] };
      fs = moved.state;
    }
    const renamed = rename(fs, source.id, dest.name);
    if (!renamed.ok) return fail(state, `mv: ${renamed.error}`);
    fs = renamed.state;
  }
  return { state: { ...state, fs }, ok: true, output: [line(mode === 'cp' ? 'Arquivo copiado.' : 'Arquivo movido/renomeado.', 'success')] };
}

export function canonicalCommand(name: string): string {
  const lower = name.toLowerCase();
  return ALIASES[lower] ?? lower;
}

export function runCommand(state: ShellState, input: string): ShellResult {
  const tokens = tokenize(input.trim());
  const echoLine = line(`${promptPath(state)}> ${input}`, 'command');
  if (tokens.length === 0) return { state, output: [echoLine] };
  const [rawName, ...args] = tokens;
  const command = canonicalCommand(rawName!);
  const handler = HANDLERS[command];
  if (!handler) {
    const result: ShellResult = {
      state: { ...state, history: [...state.history, { command, args, ok: false }] },
      output: [echoLine, line(`"${rawName}" não é um comando reconhecido. Digite help para ver a lista.`, 'error')],
    };
    return result;
  }
  const result = handler(state, args);
  return {
    state: { ...result.state, history: [...result.state.history, { command, args, ok: result.ok }] },
    output: [echoLine, ...result.output],
    ...(result.clear ? { clear: true } : {}),
  };
}
