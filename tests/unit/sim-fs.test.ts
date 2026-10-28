import { describe, expect, it } from 'vitest';
import type { FsSeedNode } from '../../src/content/types';
import {
  ROOT_ID,
  TRASH_ID,
  baseName,
  childrenOf,
  compress,
  copy,
  createFile,
  createFolder,
  createFs,
  deletePermanently,
  emptyTrash,
  extensionOf,
  extract,
  findChild,
  folderSize,
  globToRegExp,
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
  validateName,
  type FsResult,
  type FsState,
} from '../../src/domain/sim/fs';

const SEED: FsSeedNode[] = [
  {
    name: 'Documentos',
    type: 'folder',
    children: [
      { name: 'relatorio.docx', type: 'file', sizeKb: 100 },
      { name: 'notas.txt', type: 'file' },
      { name: 'Trabalho', type: 'folder', children: [{ name: 'plano.txt', type: 'file', sizeKb: 10 }] },
    ],
  },
  {
    name: 'Downloads',
    type: 'folder',
    children: [
      {
        name: 'fotos.zip',
        type: 'file',
        children: [
          { name: 'praia.jpg', type: 'file', sizeKb: 500 },
          { name: 'Album', type: 'folder', children: [{ name: 'serra.jpg', type: 'file', sizeKb: 300 }] },
        ],
      },
    ],
  },
  { name: 'Sistema', type: 'folder', children: [{ name: 'config.sys', type: 'file' }] },
];

const fresh = () => createFs(SEED, [{ name: 'antigo.txt', type: 'file' }], ['/Sistema/config.sys']);
const id = (fs: FsState, path: string) => {
  const found = resolvePath(fs, path);
  if (!found) throw new Error(`não encontrado: ${path}`);
  return found;
};
const ok = (r: FsResult): FsState => {
  if (!r.ok) throw new Error(r.error);
  return r.state;
};
const names = (fs: FsState, path: string) => childrenOf(fs, id(fs, path)).map((c) => c.name);

describe('estrutura e caminhos', () => {
  it('cria a árvore a partir da semente; caminhos ignoram maiúsculas', () => {
    const fs = fresh();
    expect(names(fs, '/')).toEqual(['Documentos', 'Downloads', 'Sistema']);
    expect(names(fs, '/Documentos')).toEqual(['Trabalho', 'notas.txt', 'relatorio.docx']); // pastas primeiro
    expect(resolvePath(fs, '/documentos/NOTAS.txt')).toBe(id(fs, '/Documentos/notas.txt'));
    expect(resolvePath(fs, '\\Documentos\\Trabalho')).toBe(id(fs, '/Documentos/Trabalho'));
    expect(resolvePath(fs, '/')).toBe(ROOT_ID);
    expect(resolvePath(fs, '/Nada')).toBeNull();
    expect(pathOf(fs, id(fs, '/Documentos/Trabalho/plano.txt'))).toBe('/Documentos/Trabalho/plano.txt');
    expect(pathOf(fs, ROOT_ID)).toBe('/');
  });

  it('itens iniciais da Lixeira e protegidos', () => {
    const fs = fresh();
    expect(trashItems(fs).map((i) => i.name)).toEqual(['antigo.txt']);
    expect(fs.protectedIds).toEqual([id(fs, '/Sistema/config.sys')]);
    expect(fs.violations).toBe(0);
  });

  it('zip da semente guarda o conteúdo e tem tamanho estimado', () => {
    const fs = fresh();
    const zip = fs.items[id(fs, '/Downloads/fotos.zip')]!;
    expect(zip.type).toBe('file');
    expect(zip.archive).toHaveLength(2);
    // tamanho estimado: menor que o conteúdo (500 + 300 KB), nunca zero
    expect(zip.sizeKb).toBeGreaterThan(0);
    expect(zip.sizeKb).toBeLessThan(800);
  });

  it('extensões e nomes-base', () => {
    expect(extensionOf('foto.JPG')).toBe('jpg');
    expect(extensionOf('.oculto')).toBe('');
    expect(extensionOf('LEIAME')).toBe('');
    expect(baseName('relatorio.final.docx')).toBe('relatorio.final');
    expect(folderSize(fresh(), id(fresh(), '/Documentos'))).toBe(100 + 24 + 10);
  });
});

describe('criar pasta', () => {
  it('cria com nome aparado e devolve o id', () => {
    const r = createFolder(fresh(), id(fresh(), '/Documentos'), '  Faturas  ');
    expect(r.ok).toBe(true);
    const fs = ok(r);
    expect(r.ok && r.created).toBe(id(fs, '/Documentos/Faturas'));
    expect(fs.items[id(fs, '/Documentos/Faturas')]!.name).toBe('Faturas');
  });

  it('nome repetido é recusado; com `unique` ganha sufixo', () => {
    const fs = fresh();
    const docs = id(fs, '/Documentos');
    const dup = createFolder(fs, docs, 'trabalho');
    expect(dup.ok).toBe(false);
    expect(dup.state).toBe(fs);
    const unique = ok(createFolder(fs, docs, 'Trabalho', true));
    expect(names(unique, '/Documentos')).toContain('Trabalho (2)');
  });

  it('nomes inválidos', () => {
    const fs = fresh();
    for (const bad of ['', '   ', 'a/b', 'a:b', 'x*', 'que?', '"aspas"', '<tag>', 'cano|', '.', '..', 'x'.repeat(81)]) {
      const r = createFolder(fs, ROOT_ID, bad);
      expect(r.ok, `"${bad}" deveria ser recusado`).toBe(false);
    }
    expect(validateName('Relatórios 2026')).toBeNull();
  });

  it('destino precisa ser uma pasta', () => {
    const fs = fresh();
    expect(createFolder(fs, id(fs, '/Documentos/notas.txt'), 'X').ok).toBe(false);
    expect(createFolder(fs, 'nao-existe', 'X').ok).toBe(false);
  });

  it('não altera o estado original (imutável)', () => {
    const fs = fresh();
    const snapshot = structuredClone(fs);
    ok(createFolder(fs, ROOT_ID, 'Nova'));
    expect(fs).toEqual(snapshot);
  });
});

describe('renomear', () => {
  it('renomeia', () => {
    const fs = fresh();
    const next = ok(rename(fs, id(fs, '/Documentos/notas.txt'), 'resumo.txt'));
    expect(resolvePath(next, '/Documentos/resumo.txt')).not.toBeNull();
    expect(resolvePath(next, '/Documentos/notas.txt')).toBeNull();
  });

  it('conflito com outro item da mesma pasta (sem diferenciar maiúsculas)', () => {
    const fs = fresh();
    const r = rename(fs, id(fs, '/Documentos/notas.txt'), 'RELATORIO.docx');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/Já existe/);
    expect(r.state).toBe(fs);
  });

  it('mudar só a caixa do próprio nome é permitido', () => {
    const fs = fresh();
    const next = ok(rename(fs, id(fs, '/Documentos/notas.txt'), 'Notas.txt'));
    expect(next.items[id(next, '/Documentos/notas.txt')]!.name).toBe('Notas.txt');
  });

  it('caracteres inválidos e raiz', () => {
    const fs = fresh();
    expect(rename(fs, id(fs, '/Documentos/notas.txt'), 'notas:2.txt').ok).toBe(false);
    expect(rename(fs, id(fs, '/Documentos/notas.txt'), 'a\\b').ok).toBe(false);
    expect(rename(fs, ROOT_ID, 'raiz').ok).toBe(false);
  });
});

describe('mover', () => {
  it('move arquivos para outra pasta', () => {
    const fs = fresh();
    const next = ok(move(fs, [id(fs, '/Documentos/notas.txt'), id(fs, '/Documentos/relatorio.docx')], id(fs, '/Documentos/Trabalho')));
    expect(names(next, '/Documentos/Trabalho')).toEqual(['notas.txt', 'plano.txt', 'relatorio.docx']);
    expect(names(next, '/Documentos')).toEqual(['Trabalho']);
  });

  it('mover uma pasta para dentro de si mesma (ou de uma subpasta) é erro', () => {
    const fs = fresh();
    const docs = id(fs, '/Documentos');
    const self = move(fs, [docs], docs);
    const trabalho = id(fs, '/Documentos/Trabalho');
    const intoSelf = move(fs, [trabalho], trabalho);
    expect(intoSelf.ok).toBe(false);
    if (!intoSelf.ok) expect(intoSelf.error).toMatch(/dentro dela mesma/);
    const intoChild = move(fs, [docs], trabalho);
    expect(intoChild.ok).toBe(false);
    expect(intoChild.state).toBe(fs);
    expect(self.ok).toBe(false);
  });

  it('conflito de nome no destino', () => {
    let fs = fresh();
    fs = ok(createFile(fs, id(fs, '/Documentos/Trabalho'), 'notas.txt'));
    const r = move(fs, [id(fs, '/Documentos/notas.txt')], id(fs, '/Documentos/Trabalho'));
    expect(r.ok).toBe(false);
  });

  it('destino precisa ser pasta', () => {
    const fs = fresh();
    expect(move(fs, [id(fs, '/Documentos/notas.txt')], id(fs, '/Documentos/relatorio.docx')).ok).toBe(false);
  });

  it('mover item protegido (ou a pasta que o contém) gera violação', () => {
    const fs = fresh();
    const r1 = move(fs, [id(fs, '/Sistema/config.sys')], id(fs, '/Documentos'));
    expect(r1.ok).toBe(false);
    expect(r1.state.violations).toBe(1);
    expect(resolvePath(r1.state, '/Sistema/config.sys')).not.toBeNull();
    const r2 = move(r1.state, [id(fs, '/Sistema')], id(fs, '/Documentos'));
    expect(r2.ok).toBe(false);
    expect(r2.state.violations).toBe(2);
  });
});

describe('copiar', () => {
  it('copia arquivos e pastas com o conteúdo', () => {
    const fs = fresh();
    const next = ok(copy(fs, [id(fs, '/Documentos/Trabalho')], id(fs, '/Downloads')));
    expect(names(next, '/Downloads/Trabalho')).toEqual(['plano.txt']);
    expect(names(next, '/Documentos/Trabalho')).toEqual(['plano.txt']);
    expect(id(next, '/Downloads/Trabalho/plano.txt')).not.toBe(id(next, '/Documentos/Trabalho/plano.txt'));
  });

  it('copiar com novo nome e sobrescrever arquivo existente', () => {
    let fs = fresh();
    fs = ok(copy(fs, [id(fs, '/Documentos/notas.txt')], id(fs, '/Documentos'), 'copia.txt'));
    expect(names(fs, '/Documentos')).toContain('copia.txt');
    const again = ok(copy(fs, [id(fs, '/Documentos/notas.txt')], id(fs, '/Documentos'), 'copia.txt'));
    expect(names(again, '/Documentos').filter((n) => n === 'copia.txt')).toHaveLength(1);
  });
});

describe('Lixeira', () => {
  it('enviar para a Lixeira tira o item da pasta', () => {
    const fs = fresh();
    const notas = id(fs, '/Documentos/notas.txt');
    const next = ok(moveToTrash(fs, [notas]));
    expect(next.items[notas]!.parent).toBe(TRASH_ID);
    expect(isInTrash(next, notas)).toBe(true);
    expect(resolvePath(next, '/Documentos/notas.txt')).toBeNull();
    expect(trashItems(next).map((i) => i.name)).toEqual(['antigo.txt', 'notas.txt']);
    expect(pathOf(next, notas)).toBe('Lixeira/notas.txt');
  });

  it('itens dentro de uma pasta na Lixeira também estão na Lixeira', () => {
    const fs = fresh();
    const next = ok(moveToTrash(fs, [id(fs, '/Documentos/Trabalho')]));
    expect(isInTrash(next, id(fs, '/Documentos/Trabalho/plano.txt'))).toBe(true);
  });

  it('restaurar volta para a pasta de origem', () => {
    const fs = fresh();
    const notas = id(fs, '/Documentos/notas.txt');
    const restored = ok(restore(ok(moveToTrash(fs, [notas])), [notas]));
    expect(resolvePath(restored, '/Documentos/notas.txt')).toBe(notas);
    expect(trashItems(restored).map((i) => i.name)).toEqual(['antigo.txt']);
  });

  it('restaurar com o nome já ocupado ganha sufixo', () => {
    let fs = fresh();
    const notas = id(fs, '/Documentos/notas.txt');
    fs = ok(moveToTrash(fs, [notas]));
    fs = ok(createFile(fs, id(fs, '/Documentos'), 'notas.txt'));
    fs = ok(restore(fs, [notas]));
    expect(fs.items[notas]!.name).toBe('notas (2).txt');
  });

  it('se a pasta de origem também está na Lixeira, restaura na raiz', () => {
    let fs = fresh();
    const plano = id(fs, '/Documentos/Trabalho/plano.txt');
    fs = ok(moveToTrash(fs, [plano]));
    fs = ok(moveToTrash(fs, [id(fs, '/Documentos/Trabalho')]));
    fs = ok(restore(fs, [plano]));
    expect(resolvePath(fs, '/plano.txt')).toBe(plano);
  });

  it('esvaziar remove definitivamente (inclusive o conteúdo das pastas)', () => {
    let fs = fresh();
    const plano = id(fs, '/Documentos/Trabalho/plano.txt');
    fs = ok(moveToTrash(fs, [id(fs, '/Documentos/Trabalho')]));
    fs = ok(emptyTrash(fs));
    expect(fs.trash).toEqual([]);
    expect(fs.trashEmptied).toBe(true);
    expect(fs.items[plano]).toBeUndefined();
    expect(trashItems(fs)).toEqual([]);
  });

  it('item protegido não vai para a Lixeira nem é apagado: violação', () => {
    const fs = fresh();
    const config = id(fs, '/Sistema/config.sys');
    const r1 = moveToTrash(fs, [config]);
    expect(r1.ok).toBe(false);
    expect(r1.state.violations).toBe(1);
    expect(isInTrash(r1.state, config)).toBe(false);
    const r2 = moveToTrash(r1.state, [id(fs, '/Sistema')]);
    expect(r2.state.violations).toBe(2);
    const r3 = deletePermanently(r2.state, [config]);
    expect(r3.ok).toBe(false);
    expect(r3.state.violations).toBe(3);
    expect(r3.state.items[config]).toBeDefined();
    expect(fs.violations).toBe(0);
  });
});

describe('abrir', () => {
  it('registra arquivos abertos uma única vez; pasta não abre', () => {
    const fs = fresh();
    const notas = id(fs, '/Documentos/notas.txt');
    const once = ok(openFile(fs, notas));
    expect(ok(openFile(once, notas)).opened).toEqual([notas]);
    expect(openFile(fs, id(fs, '/Documentos')).ok).toBe(false);
  });
});

describe('compactar e extrair', () => {
  it('compactar vários itens cria um .zip com o nome do primeiro', () => {
    const fs = fresh();
    const docs = id(fs, '/Documentos');
    const r = compress(fs, [id(fs, '/Documentos/relatorio.docx'), id(fs, '/Documentos/notas.txt')], docs);
    const next = ok(r);
    const zipId = id(next, '/Documentos/relatorio.zip');
    expect(r.ok && r.created).toBe(zipId);
    const zip = next.items[zipId]!;
    expect(zip.archive?.map((n) => n.name)).toEqual(['relatorio.docx', 'notas.txt']);
    expect(zip.sizeKb).toBe(Math.round((100 + 24) * 0.6));
    // os originais continuam lá
    expect(names(next, '/Documentos')).toEqual(expect.arrayContaining(['notas.txt', 'relatorio.docx']));
    // compactar de novo não sobrescreve
    expect(names(ok(compress(next, [id(next, '/Documentos/relatorio.docx')], docs)), '/Documentos')).toContain('relatorio (2).zip');
  });

  it('compactar uma pasta leva as subpastas', () => {
    const fs = fresh();
    const next = ok(compress(fs, [id(fs, '/Documentos/Trabalho')], id(fs, '/Documentos')));
    const zip = next.items[id(next, '/Documentos/Trabalho.zip')]!;
    expect(zip.archive).toEqual([{ name: 'Trabalho', type: 'folder', children: [{ name: 'plano.txt', type: 'file', sizeKb: 10 }] }]);
  });

  it('nada selecionado na pasta: erro', () => {
    const fs = fresh();
    expect(compress(fs, [], ROOT_ID).ok).toBe(false);
    expect(compress(fs, [id(fs, '/Documentos/notas.txt')], ROOT_ID).ok).toBe(false);
  });

  it('extrair cria uma pasta com o conteúdo do zip', () => {
    const fs = fresh();
    const zip = id(fs, '/Downloads/fotos.zip');
    const next = ok(extract(fs, zip));
    expect(names(next, '/Downloads/fotos')).toEqual(['Album', 'praia.jpg']);
    expect(names(next, '/Downloads/fotos/Album')).toEqual(['serra.jpg']);
    expect(next.items[id(next, '/Downloads/fotos/praia.jpg')]!.sizeKb).toBe(500);
    const twice = ok(extract(next, zip));
    expect(names(twice, '/Downloads')).toEqual(['fotos', 'fotos (2)', 'fotos.zip']);
  });

  it('compactar e extrair preserva a árvore', () => {
    let fs = fresh();
    fs = ok(compress(fs, [id(fs, '/Documentos/Trabalho')], id(fs, '/Documentos')));
    fs = ok(moveToTrash(fs, [id(fs, '/Documentos/Trabalho')]));
    fs = ok(extract(fs, id(fs, '/Documentos/Trabalho.zip')));
    expect(resolvePath(fs, '/Documentos/Trabalho/Trabalho/plano.txt')).not.toBeNull();
  });

  it('extrair algo que não é zip: erro', () => {
    const fs = fresh();
    expect(extract(fs, id(fs, '/Documentos/notas.txt')).ok).toBe(false);
  });
});

describe('busca', () => {
  it('encontra por parte do nome, sem diferenciar maiúsculas, ordenado', () => {
    const fs = fresh();
    expect(search(fs, '.TXT').map((i) => i.name)).toEqual(['notas.txt', 'plano.txt']);
    expect(search(fs, 'relat').map((i) => i.name)).toEqual(['relatorio.docx']);
  });

  it('ignora itens na Lixeira e consulta vazia', () => {
    let fs = fresh();
    expect(search(fs, 'antigo')).toEqual([]);
    fs = ok(moveToTrash(fs, [id(fs, '/Documentos/Trabalho')]));
    expect(search(fs, 'plano')).toEqual([]);
    expect(search(fs, '   ')).toEqual([]);
  });
});

describe('curingas', () => {
  it('globToRegExp', () => {
    const re = globToRegExp('*.txt');
    expect(re.test('NOTAS.TXT')).toBe(true);
    expect(re.test('notas.txt.bak')).toBe(false);
    expect(globToRegExp('foto?.jpg').test('foto1.jpg')).toBe(true);
    expect(globToRegExp('a+b(1).txt').test('a+b(1).txt')).toBe(true);
  });

  it('findChild', () => {
    const fs = fresh();
    expect(findChild(fs, ROOT_ID, 'downloads')?.name).toBe('Downloads');
  });
});
