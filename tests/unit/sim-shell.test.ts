import { describe, expect, it } from 'vitest';
import type { FsSeedNode } from '../../src/content/types';
import { ROOT_ID, childrenOf, createFs, resolvePath } from '../../src/domain/sim/fs';
import { canonicalCommand, createShell, promptPath, runCommand, tokenize, type ShellResult, type ShellState } from '../../src/domain/sim/shell';

const SEED: FsSeedNode[] = [
  {
    name: 'Área de Trabalho',
    type: 'folder',
    children: [{ name: 'atalho.lnk', type: 'file' }],
  },
  {
    name: 'Documentos',
    type: 'folder',
    children: [
      { name: 'a.txt', type: 'file', sizeKb: 2 },
      { name: 'b.txt', type: 'file', sizeKb: 3 },
      { name: 'foto.jpg', type: 'file' },
      { name: 'Arquivo', type: 'folder', children: [] },
      { name: 'Projetos', type: 'folder', children: [{ name: 'p.txt', type: 'file' }] },
    ],
  },
  { name: 'Sistema', type: 'folder', children: [{ name: 'kernel.sys', type: 'file' }] },
];

function shell(path = '/', network?: { online?: boolean; dnsWorking?: boolean }): ShellState {
  return createShell(createFs(SEED, [], ['/Sistema/kernel.sys']), path, network);
}

/** Executa uma sequência de comandos e devolve o último resultado. */
function run(state: ShellState, ...lines: string[]): ShellResult {
  let result: ShellResult = { state, output: [] };
  for (const line of lines) result = runCommand(result.state, line);
  return result;
}

const texts = (r: ShellResult) => r.output.map((l) => l.text);
const names = (state: ShellState, path: string) => childrenOf(state.fs, resolvePath(state.fs, path)!).map((c) => c.name);
const last = (state: ShellState) => state.history[state.history.length - 1];

describe('tokenize', () => {
  it('separa por espaços e respeita aspas', () => {
    expect(tokenize('cd "Área de Trabalho"')).toEqual(['cd', 'Área de Trabalho']);
    expect(tokenize("echo 'olá mundo'")).toEqual(['echo', 'olá mundo']);
    expect(tokenize('  ls    -l   ')).toEqual(['ls', '-l']);
    expect(tokenize('cp "meu arquivo.txt" Backup/')).toEqual(['cp', 'meu arquivo.txt', 'Backup/']);
  });

  it('aspas vazias geram um argumento vazio', () => {
    expect(tokenize('mkdir ""')).toEqual(['mkdir', '']);
  });

  it('redirecionamento > e >> mesmo sem espaços', () => {
    expect(tokenize('echo oi > notas.txt')).toEqual(['echo', 'oi', '>', 'notas.txt']);
    expect(tokenize('echo oi>>log.txt')).toEqual(['echo', 'oi', '>>', 'log.txt']);
    expect(tokenize('echo "a > b"')).toEqual(['echo', 'a > b']);
  });

  it('linha vazia', () => {
    expect(tokenize('   ')).toEqual([]);
  });
});

describe('criação do shell', () => {
  it('começa no caminho indicado; caminho inexistente para no último trecho válido', () => {
    expect(promptPath(shell('/Documentos/Projetos'))).toBe('/Documentos/Projetos');
    expect(promptPath(shell('/Documentos/Nada'))).toBe('/Documentos');
    expect(shell().cwd).toBe(ROOT_ID);
  });

  it('rede funcionando por padrão', () => {
    expect(shell().network).toEqual({ online: true, dnsWorking: true });
  });
});

describe('navegação: cd, ls, pwd', () => {
  it('cd entra e sai de pastas; pwd mostra o caminho', () => {
    let r = run(shell(), 'cd Documentos', 'pwd');
    expect(texts(r)).toEqual(['/Documentos> pwd', '/Documentos']);
    r = run(r.state, 'cd Projetos', 'cd ..', 'pwd');
    expect(texts(r)[1]).toBe('/Documentos');
    r = run(r.state, 'cd /', 'pwd');
    expect(texts(r)[1]).toBe('/');
    r = run(r.state, 'cd Documentos/Projetos');
    expect(promptPath(r.state)).toBe('/Documentos/Projetos');
    r = run(r.state, 'cd');
    expect(r.state.cwd).toBe(ROOT_ID);
  });

  it('cd com aspas, sem diferenciar maiúsculas', () => {
    const r = run(shell(), 'cd "área de trabalho"');
    expect(promptPath(r.state)).toBe('/Área de Trabalho');
    expect(last(r.state)).toEqual({ command: 'cd', args: ['área de trabalho'], ok: true });
  });

  it('cd .. na raiz continua na raiz', () => {
    expect(run(shell(), 'cd ..').state.cwd).toBe(ROOT_ID);
  });

  it('cd para pasta inexistente ou arquivo falha sem mudar de pasta', () => {
    const start = run(shell(), 'cd Documentos').state;
    const missing = run(start, 'cd Nada');
    expect(missing.state.cwd).toBe(start.cwd);
    expect(missing.output[1]!.tone).toBe('error');
    expect(last(missing.state)!.ok).toBe(false);
    const file = run(start, 'cd a.txt');
    expect(texts(file)[1]).toMatch(/é um arquivo/);
    expect(file.state.cwd).toBe(start.cwd);
  });

  it('ls lista pastas (com "/") e arquivos com tamanho', () => {
    const r = run(shell('/Documentos'), 'ls');
    expect(texts(r).slice(1)).toEqual(['Arquivo/', 'Projetos/', 'a.txt  2 KB', 'b.txt  3 KB', 'foto.jpg  24 KB']);
    expect(r.output[1]!.tone).toBe('folder');
  });

  it('ls com curinga e com caminho', () => {
    expect(texts(run(shell('/Documentos'), 'ls *.txt')).slice(1)).toEqual(['a.txt  2 KB', 'b.txt  3 KB']);
    expect(texts(run(shell(), 'ls Documentos/*.TXT')).slice(1)).toEqual(['a.txt  2 KB', 'b.txt  3 KB']);
    expect(texts(run(shell(), 'ls Documentos/Arquivo')).slice(1)).toEqual(['(pasta vazia)']);
    expect(last(run(shell(), 'ls Nada').state)!.ok).toBe(false);
  });
});

describe('mkdir', () => {
  it('cria uma ou várias pastas', () => {
    const r = run(shell('/Documentos'), 'mkdir Faturas "Notas Fiscais"');
    expect(names(r.state, '/Documentos')).toEqual(expect.arrayContaining(['Faturas', 'Notas Fiscais']));
    expect(last(r.state)).toEqual({ command: 'mkdir', args: ['Faturas', 'Notas Fiscais'], ok: true });
  });

  it('pasta existente, nome inválido ou sem argumento falham', () => {
    const base = shell('/Documentos');
    for (const line of ['mkdir Projetos', 'mkdir "a:b"', 'mkdir']) {
      const r = run(base, line);
      expect(last(r.state)!.ok, line).toBe(false);
      expect(r.state.fs).toBe(base.fs);
    }
  });
});

describe('mv, cp e rm', () => {
  it('mv renomeia no lugar', () => {
    const r = run(shell('/Documentos'), 'mv a.txt resumo.txt');
    expect(names(r.state, '/Documentos')).toContain('resumo.txt');
    expect(names(r.state, '/Documentos')).not.toContain('a.txt');
  });

  it('mv move para pasta existente e aceita curinga', () => {
    const r = run(shell('/Documentos'), 'mv *.txt Arquivo');
    expect(names(r.state, '/Documentos/Arquivo')).toEqual(['a.txt', 'b.txt']);
    expect(names(r.state, '/Documentos')).toEqual(['Arquivo', 'Projetos', 'foto.jpg']);
    expect(last(r.state)!.ok).toBe(true);
  });

  it('mv move e renomeia ao mesmo tempo', () => {
    const r = run(shell('/Documentos'), 'mv a.txt Arquivo/novo.txt');
    expect(names(r.state, '/Documentos/Arquivo')).toEqual(['novo.txt']);
  });

  it('mv recusa sobrescrever e pasta dentro de si mesma', () => {
    expect(last(run(shell('/Documentos'), 'mv a.txt b.txt').state)!.ok).toBe(false);
    expect(last(run(shell(), 'mv Documentos Documentos/Projetos').state)!.ok).toBe(false);
  });

  it('cp copia com novo nome e para pasta, com curinga', () => {
    let r = run(shell('/Documentos'), 'cp a.txt copia.txt');
    expect(names(r.state, '/Documentos')).toEqual(expect.arrayContaining(['a.txt', 'copia.txt']));
    r = run(r.state, 'cp *.txt Arquivo');
    expect(names(r.state, '/Documentos/Arquivo')).toEqual(['a.txt', 'b.txt', 'copia.txt']);
    expect(names(r.state, '/Documentos')).toContain('a.txt');
  });

  it('cp/mv com vários arquivos exigem pasta de destino', () => {
    expect(last(run(shell('/Documentos'), 'cp *.txt nova.txt').state)!.ok).toBe(false);
    expect(last(run(shell('/Documentos'), 'mv a.txt').state)!.ok).toBe(false);
  });

  it('rm com curinga apaga só os arquivos que combinam, sem Lixeira', () => {
    const r = run(shell('/Documentos'), 'rm *.txt');
    expect(names(r.state, '/Documentos')).toEqual(['Arquivo', 'Projetos', 'foto.jpg']);
    expect(r.state.fs.trash).toEqual([]);
    expect(texts(r)[1]).toBe('2 arquivo(s) apagado(s) definitivamente.');
    // arquivos de subpastas não são afetados
    expect(names(r.state, '/Documentos/Projetos')).toEqual(['p.txt']);
  });

  it('rm não apaga pasta', () => {
    const r = run(shell('/Documentos'), 'rm Projetos');
    expect(last(r.state)!.ok).toBe(false);
    expect(texts(r)[1]).toMatch(/é uma pasta/);
    expect(names(r.state, '/Documentos')).toContain('Projetos');
  });

  it('rm sem correspondência, opção -rf ou arquivo inexistente falham', () => {
    for (const line of ['rm *.pdf', 'rm -rf Projetos', 'rm nada.txt', 'rm']) {
      const r = run(shell('/Documentos'), line);
      expect(last(r.state)!.ok, line).toBe(false);
      expect(names(r.state, '/Documentos')).toHaveLength(5);
    }
  });

  it('rm em arquivo protegido conta violação e falha', () => {
    const r = run(shell('/Sistema'), 'rm kernel.sys');
    expect(last(r.state)!.ok).toBe(false);
    expect(r.state.fs.violations).toBe(1);
    expect(names(r.state, '/Sistema')).toEqual(['kernel.sys']);
  });

  it('rmdir só remove pasta vazia', () => {
    expect(last(run(shell('/Documentos'), 'rmdir Projetos').state)!.ok).toBe(false);
    const r = run(shell('/Documentos'), 'rmdir Arquivo');
    expect(last(r.state)!.ok).toBe(true);
    expect(names(r.state, '/Documentos')).not.toContain('Arquivo');
  });

  it('echo > arquivo cria o arquivo; cat mostra', () => {
    const r = run(shell('/Documentos'), 'echo lembrete > lembrete.txt');
    expect(names(r.state, '/Documentos')).toContain('lembrete.txt');
    expect(texts(run(r.state, 'cat lembrete.txt'))[1]).toMatch(/conteúdo de lembrete\.txt/);
    expect(texts(run(r.state, 'echo olá mundo'))[1]).toBe('olá mundo');
  });
});

describe('aliases do Windows', () => {
  it('dir = ls, del = rm, move = mv, copy = cp, type = cat, cls = clear, md = mkdir', () => {
    expect(canonicalCommand('DIR')).toBe('ls');
    expect(canonicalCommand('del')).toBe('rm');
    expect(canonicalCommand('move')).toBe('mv');
    expect(canonicalCommand('copy')).toBe('cp');
    expect(canonicalCommand('type')).toBe('cat');
    expect(canonicalCommand('cls')).toBe('clear');
    expect(canonicalCommand('md')).toBe('mkdir');
  });

  it('dir lista e fica registrado como ls', () => {
    const r = run(shell('/Documentos'), 'dir');
    expect(texts(r)).toContain('a.txt  2 KB');
    expect(last(r.state)).toEqual({ command: 'ls', args: [], ok: true });
  });

  it('del apaga e move move, com caminhos no estilo Windows', () => {
    let r = run(shell('/Documentos'), 'del a.txt');
    expect(names(r.state, '/Documentos')).not.toContain('a.txt');
    expect(last(r.state)!.command).toBe('rm');
    r = run(r.state, 'move b.txt Projetos');
    expect(names(r.state, '/Documentos/Projetos')).toEqual(['b.txt', 'p.txt']);
    expect(last(r.state)!.command).toBe('mv');
    r = run(r.state, 'cd \\Documentos\\Projetos');
    expect(promptPath(r.state)).toBe('/Documentos/Projetos');
  });

  it('cls limpa a tela', () => {
    expect(run(shell(), 'cls').clear).toBe(true);
  });
});

describe('rede simulada', () => {
  it('rede normal: ping por nome e nslookup funcionam', () => {
    const ping = run(shell(), 'ping exemplo.com');
    expect(last(ping.state)!.ok).toBe(true);
    expect(texts(ping).some((t) => t.includes('0% de perda'))).toBe(true);
    const ns = run(shell(), 'nslookup exemplo.com');
    expect(last(ns.state)!.ok).toBe(true);
    expect(texts(ns).some((t) => t.startsWith('Address:'))).toBe(true);
  });

  it('dnsWorking: false → ping por nome e nslookup falham; ping por IP funciona', () => {
    const s = shell('/', { dnsWorking: false });
    const byName = run(s, 'ping exemplo.com');
    expect(last(byName.state)!.ok).toBe(false);
    expect(texts(byName)[1]).toMatch(/DNS/);
    expect(last(run(s, 'nslookup exemplo.com').state)!.ok).toBe(false);
    const byIp = run(s, 'ping 8.8.8.8');
    expect(last(byIp.state)!.ok).toBe(true);
    expect(texts(byIp)[1]).toContain('[8.8.8.8]');
  });

  it('offline: ping e nslookup falham, localhost responde; ipconfig mostra mídia desconectada', () => {
    const s = shell('/', { online: false });
    expect(last(run(s, 'ping 8.8.8.8').state)!.ok).toBe(false);
    expect(last(run(s, 'nslookup exemplo.com').state)!.ok).toBe(false);
    expect(last(run(s, 'ping localhost').state)!.ok).toBe(true);
    const ip = run(s, 'ipconfig');
    expect(texts(ip).some((t) => t.includes('Mídia desconectada'))).toBe(true);
    expect(texts(ip).some((t) => t.includes('192.168.0.23'))).toBe(false);
  });

  it('ipconfig online mostra IP, máscara, gateway e DNS', () => {
    const out = texts(run(shell(), 'ipconfig')).join('\n');
    expect(out).toContain('192.168.0.23');
    expect(out).toContain('255.255.255.0');
    expect(out).toContain('Gateway Padrão . . . . . . . : 192.168.0.1');
    expect(out).toContain('Servidores DNS . . . . . . . : 192.168.0.1');
  });

  it('ping sem endereço falha', () => {
    expect(last(run(shell(), 'ping').state)!.ok).toBe(false);
  });
});

describe('comandos desconhecidos e histórico', () => {
  it('comando desconhecido explica e não altera os arquivos', () => {
    const s = shell();
    const r = run(s, 'format C:');
    expect(texts(r)[1]).toBe('"format" não é um comando reconhecido. Digite help para ver a lista.');
    expect(r.output[1]!.tone).toBe('error');
    expect(r.state.fs).toBe(s.fs);
    expect(r.state.history).toEqual([{ command: 'format', args: ['C:'], ok: false }]);
  });

  it('histórico registra sucesso e falha, em ordem, com o nome canônico', () => {
    const r = run(shell(), 'cd Documentos', 'cd Nada', 'DIR', 'xyz');
    expect(r.state.history).toEqual([
      { command: 'cd', args: ['Documentos'], ok: true },
      { command: 'cd', args: ['Nada'], ok: false },
      { command: 'ls', args: [], ok: true },
      { command: 'xyz', args: [], ok: false },
    ]);
  });

  it('linha vazia não entra no histórico', () => {
    const s = shell();
    const r = runCommand(s, '   ');
    expect(r.state).toBe(s);
    expect(r.output).toHaveLength(1);
  });

  it('o eco do comando mostra o prompt', () => {
    expect(runCommand(shell('/Documentos'), 'ls').output[0]).toEqual({ text: '/Documentos> ls', tone: 'command' });
  });
});
