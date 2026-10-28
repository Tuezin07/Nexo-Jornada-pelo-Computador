import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FilesystemStep, SettingsStep, TerminalStep } from '../../src/content/types';
import type { AnswerOfKind, Evaluation } from '../../src/domain/evaluators';
import { isInTrash, resolvePath } from '../../src/domain/sim/fs';
import { FilesystemChallenge } from '../../src/ui/challenges/FilesystemChallenge';
import { SettingsChallenge } from '../../src/ui/challenges/SettingsChallenge';
import { TerminalChallenge } from '../../src/ui/challenges/TerminalChallenge';

// Sem `globals: true` no Vitest, a limpeza automática do Testing Library não é registrada.
afterEach(cleanup);

const OK: Evaluation = { correct: true, score: 1, mistakes: 0, messages: [] };

const base = {
  title: 'Teste',
  prompt: 'Faça a tarefa.',
  hint: 'Dica.',
  explanation: 'Explicação.',
};

// ---------------------------------------------------------------------------
// Explorador
// ---------------------------------------------------------------------------

function fsStep(extra: Partial<FilesystemStep> = {}): FilesystemStep {
  return {
    ...base,
    id: 'fs-teste',
    kind: 'filesystem',
    concept: 'arquivos-pastas',
    root: [
      {
        name: 'Documentos',
        type: 'folder',
        children: [
          { name: 'rascunho.txt', type: 'file', sizeKb: 3 },
          { name: 'importante.xlsx', type: 'file', sizeKb: 56 },
        ],
      },
      { name: 'Downloads', type: 'folder', children: [{ name: 'comprovante.pdf.exe', type: 'file', sizeKb: 1450 }] },
    ],
    startPath: '/Documentos',
    goals: [{ type: 'exists', path: '/Documentos/Faturas', nodeType: 'folder', label: 'Crie a pasta Faturas' }],
    features: { createFolder: true, rename: true, move: true, delete: true, trash: true },
    protectedPaths: ['/Documentos/importante.xlsx'],
    trash: [{ name: 'contrato.pdf', type: 'file', sizeKb: 380 }],
    ...extra,
  };
}

function renderFs(step: FilesystemStep) {
  const submit = vi.fn<(answer: AnswerOfKind<'filesystem'>) => Evaluation>(() => OK);
  render(<FilesystemChallenge step={step} locked={false} revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);
  return { submit, user: userEvent.setup() };
}

const row = (name: string) => screen.getByRole('row', { name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`) });
const quickAccess = () => within(screen.getByRole('navigation', { name: 'Acesso rápido' }));

describe('FilesystemChallenge', () => {
  it('cria uma pasta, renomeia e envia o estado ao verificar', async () => {
    const { submit, user } = renderFs(fsStep());
    expect(screen.getByText('0 de 1 concluído')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Nova pasta/ }));
    const field = screen.getByRole('textbox', { name: 'Novo nome' });
    expect(field).toHaveFocus();
    expect(field).toHaveValue('Nova pasta');
    await user.clear(field);
    await user.type(field, 'Faturas{Enter}');

    expect(screen.queryByRole('textbox', { name: 'Novo nome' })).not.toBeInTheDocument();
    expect(row('Faturas')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Renomeado para "Faturas"');
    expect(screen.getByText('1 de 1 concluído')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(submit).toHaveBeenCalledTimes(1);
    const answer = submit.mock.calls[0]![0];
    expect(answer.kind).toBe('filesystem');
    const id = resolvePath(answer.state, '/Documentos/Faturas');
    expect(id).not.toBeNull();
    expect(answer.state.items[id!]!.type).toBe('folder');
  });

  it('renomeia pelo teclado (F2) mantendo a extensão oculta', async () => {
    const { user } = renderFs(fsStep({ features: { rename: true, extensions: true } }));
    const grid = screen.getByRole('grid');
    grid.focus();
    await user.keyboard('{ArrowDown}');
    expect(row('importante')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{F2}');
    const field = screen.getByRole('textbox', { name: 'Novo nome' });
    expect(field).toHaveValue('importante');
    await user.clear(field);
    await user.type(field, 'orcamento{Enter}');
    expect(row('orcamento')).toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: 'Mostrar extensões' }));
    expect(row('orcamento.xlsx')).toBeInTheDocument();
  });

  it('move para a Lixeira e restaura', async () => {
    const step = fsStep({
      goals: [
        { type: 'inTrash', name: 'rascunho.txt', label: 'Exclua o rascunho' },
        { type: 'notInTrash', name: 'contrato.pdf', label: 'Restaure o contrato' },
      ],
    });
    const { submit, user } = renderFs(step);

    await user.click(row('rascunho.txt'));
    await user.click(screen.getByRole('button', { name: /Excluir/ }));
    expect(screen.getByRole('status')).toHaveTextContent('"rascunho.txt" foi para a Lixeira.');
    expect(screen.queryByRole('row', { name: /^rascunho\.txt,/ })).not.toBeInTheDocument();

    await user.click(quickAccess().getByRole('button', { name: /^Lixeira/ }));
    expect(screen.getByRole('grid', { name: 'Itens na Lixeira' })).toBeInTheDocument();
    expect(row('rascunho.txt')).toBeInTheDocument();
    await user.click(row('contrato.pdf'));
    await user.click(screen.getByRole('button', { name: /Restaurar/ }));
    expect(screen.getByRole('status')).toHaveTextContent('"contrato.pdf" foi restaurado para Este computador.');
    expect(screen.queryByRole('row', { name: /^contrato\.pdf,/ })).not.toBeInTheDocument();
    expect(screen.getByText('2 de 2 concluídos')).toBeInTheDocument();

    await user.click(quickAccess().getByRole('button', { name: 'Documentos' }));
    expect(screen.queryByRole('row', { name: /^rascunho\.txt,/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    const state = submit.mock.calls[0]![0].state;
    expect(resolvePath(state, '/contrato.pdf')).not.toBeNull();
    const rascunho = Object.values(state.items).find((i) => i.name === 'rascunho.txt')!;
    expect(isInTrash(state, rascunho.id)).toBe(true);
  });

  it('esvazia a Lixeira só depois de confirmar', async () => {
    const { user } = renderFs(fsStep());
    await user.click(quickAccess().getByRole('button', { name: /^Lixeira/ }));
    await user.click(screen.getByRole('button', { name: /Esvaziar Lixeira/ }));
    const dialog = screen.getByRole('dialog', { name: 'Esvaziar a Lixeira?' });
    await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }));
    expect(row('contrato.pdf')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Esvaziar Lixeira/ }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Esvaziar Lixeira/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('A Lixeira está vazia.')).toBeInTheDocument();
  });

  it('mostra o erro do sistema ao excluir um item protegido e conta a violação', async () => {
    const { submit, user } = renderFs(fsStep());
    await user.click(row('importante.xlsx'));
    await user.click(screen.getByRole('button', { name: /Excluir/ }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Erro: Este arquivo é importante e não deve ser excluído.');
    expect(row('importante.xlsx')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(submit.mock.calls[0]![0].state.violations).toBe(1);
  });

  it('move a seleção com o diálogo "Mover para…"', async () => {
    const { submit, user } = renderFs(fsStep());
    await user.click(row('rascunho.txt'));
    await user.click(screen.getByRole('button', { name: /Mover para/ }));
    const dialog = screen.getByRole('dialog', { name: 'Mover para…' });
    expect(within(dialog).getByRole('radio', { name: /Documentos/ })).toBeDisabled();
    await user.click(within(dialog).getByRole('radio', { name: /Downloads/ }));
    await user.click(within(dialog).getByRole('button', { name: /Mover aqui/ }));
    expect(screen.getByRole('status')).toHaveTextContent('"rascunho.txt" movido para Downloads.');

    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(resolvePath(submit.mock.calls[0]![0].state, '/Downloads/rascunho.txt')).not.toBeNull();
  });

  it('abre arquivos e navega pela trilha até "Este computador"', async () => {
    const step = fsStep({ startPath: '/Downloads', goals: [{ type: 'opened', path: '/Documentos/rascunho.txt', label: 'Abra o rascunho' }] });
    const { submit, user } = renderFs(step);
    await user.click(screen.getByRole('button', { name: 'Subir um nível' }));
    expect(within(screen.getByRole('navigation', { name: 'Local atual' })).getByText('Este computador')).toHaveAttribute('aria-current', 'location');
    await user.dblClick(row('Documentos'));
    await user.dblClick(row('rascunho.txt'));
    expect(screen.getByRole('status')).toHaveTextContent('Abrindo rascunho.txt…');
    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    const state = submit.mock.calls[0]![0].state;
    expect(state.opened).toContain(resolvePath(state, '/Documentos/rascunho.txt'));
  });

  it('busca mostra o local de cada item e abrir uma pasta encontrada navega até ela', async () => {
    const { user } = renderFs(fsStep({ features: { search: true } }));
    const searchbox = screen.getByRole('searchbox', { name: 'Buscar arquivos e pastas' });
    await user.type(searchbox, 'compro');
    expect(screen.getByRole('grid', { name: 'Resultados da busca por compro' })).toBeInTheDocument();
    expect(row('comprovante.pdf.exe')).toHaveAccessibleName(/em \/Downloads/);

    await user.clear(searchbox);
    await user.type(searchbox, 'Down');
    await user.dblClick(row('Downloads'));
    expect(screen.getByRole('grid', { name: 'Conteúdo de Downloads' })).toBeInTheDocument();
    expect(searchbox).toHaveValue('');
  });

  it('desabilita a interação quando a etapa está bloqueada', () => {
    const submit = vi.fn<(answer: AnswerOfKind<'filesystem'>) => Evaluation>(() => OK);
    render(<FilesystemChallenge step={fsStep()} locked revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);
    expect(screen.getByRole('button', { name: /Nova pasta/ })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Verificar' })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Terminal
// ---------------------------------------------------------------------------

function terminalStep(extra: Partial<TerminalStep> = {}): TerminalStep {
  return {
    ...base,
    id: 'term-teste',
    kind: 'terminal',
    concept: 'terminal-basico',
    root: [
      { name: 'Documentos', type: 'folder', children: [{ name: 'notas.txt', type: 'file', sizeKb: 2 }] },
      { name: 'Downloads', type: 'folder', children: [] },
    ],
    startPath: '/Documentos',
    goals: [
      { type: 'exists', path: '/Documentos/Projetos', nodeType: 'folder', label: 'Crie a pasta Projetos' },
      { type: 'cwd', path: '/Documentos/Projetos', label: 'Entre na pasta Projetos' },
      { type: 'ran', command: 'ls', label: 'Liste o conteúdo' },
    ],
    suggestions: ['ls', 'mkdir Projetos'],
    ...extra,
  };
}

function renderTerminal(step: TerminalStep) {
  const submit = vi.fn<(answer: AnswerOfKind<'terminal'>) => Evaluation>(() => OK);
  render(<TerminalChallenge step={step} locked={false} revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);
  return { submit, user: userEvent.setup(), input: screen.getByRole('textbox', { name: 'Comando' }), log: screen.getByRole('log') };
}

describe('TerminalChallenge', () => {
  it('executa mkdir, cd e pwd e mostra a saída', async () => {
    const { user, input, log, submit } = renderTerminal(terminalStep());
    expect(log).toHaveTextContent('NexoShell — ambiente simulado e seguro.');

    await user.type(input, 'mkdir Projetos{Enter}');
    expect(log).toHaveTextContent('Pasta criada: Projetos');
    expect(input).toHaveValue('');

    await user.type(input, 'cd Projetos{Enter}');
    await user.type(input, 'pwd{Enter}');
    expect(log).toHaveTextContent('/Documentos/Projetos> pwd');
    expect(within(log).getAllByText('/Documentos/Projetos').length).toBeGreaterThan(0);

    await user.type(input, 'cd Inexistente{Enter}');
    expect(log).toHaveTextContent('Erro: cd: a pasta "Inexistente" não existe aqui.');
    expect(screen.getByText('2 de 3 concluídos')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    const state = submit.mock.calls[0]![0].state;
    expect(state.cwd).toBe(resolvePath(state.fs, '/Documentos/Projetos'));
    expect(state.history.map((h) => h.command)).toEqual(['mkdir', 'cd', 'pwd', 'cd']);
  });

  it('recupera o histórico com as setas', async () => {
    const { user, input } = renderTerminal(terminalStep());
    await user.type(input, 'ls{Enter}');
    await user.type(input, 'pwd{Enter}');
    await user.type(input, 'rascun');
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('pwd');
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('ls');
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('ls');
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveValue('pwd');
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveValue('rascun');
  });

  it('sugestões preenchem a linha sem executar', async () => {
    const { user, input, log } = renderTerminal(terminalStep());
    await user.click(screen.getByRole('button', { name: 'Preencher com mkdir Projetos' }));
    expect(input).toHaveValue('mkdir Projetos');
    expect(input).toHaveFocus();
    expect(log).not.toHaveTextContent('Pasta criada');
    expect(screen.getByText('0 de 3 concluídos')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(log).toHaveTextContent('Pasta criada: Projetos');
  });

  it('clear limpa a tela e Tab completa nomes', async () => {
    const { user, input, log } = renderTerminal(terminalStep({ startPath: '/' }));
    await user.type(input, 'cd Doc');
    await user.keyboard('{Tab}');
    expect(input).toHaveValue('cd Documentos');
    expect(input).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.type(input, 'clear{Enter}');
    expect(within(log).queryByText(/NexoShell/)).not.toBeInTheDocument();
    expect(log).toBeEmptyDOMElement();
  });

  it('não deixa as teclas chegarem aos atalhos globais', async () => {
    const globalShortcut = vi.fn();
    document.addEventListener('keydown', globalShortcut);
    try {
      const { user, input } = renderTerminal(terminalStep());
      await user.type(input, 'help{Enter}');
      expect(globalShortcut).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener('keydown', globalShortcut);
    }
  });

  it('clicar na área do terminal foca a entrada', async () => {
    const { user, input, log } = renderTerminal(terminalStep());
    input.blur();
    await user.click(log);
    expect(input).toHaveFocus();
  });
});

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------

function settingsStep(): SettingsStep {
  return {
    ...base,
    id: 'cfg-teste',
    kind: 'settings',
    concept: 'configuracoes-tela',
    panels: [
      {
        id: 'tela',
        title: 'Sistema > Tela',
        groups: [
          {
            title: 'Brilho e cor',
            controls: [
              { id: 'brilho', type: 'slider', label: 'Brilho', min: 0, max: 100, step: 5, initial: 70, unit: '%' },
              { id: 'luz', type: 'toggle', label: 'Luz noturna', description: 'Cores mais quentes', initial: false },
            ],
          },
          {
            title: 'Escala',
            controls: [
              {
                id: 'escala',
                type: 'select',
                label: 'Escala',
                options: [
                  { value: '100', label: '100%' },
                  { value: '125', label: '125% (Recomendável)' },
                ],
                initial: '100',
              },
            ],
          },
        ],
      },
      {
        id: 'apps',
        title: 'Aplicativos > Aplicativos instalados',
        groups: [
          {
            title: 'Instalados',
            controls: [
              { id: 'turbo', type: 'app', label: 'PC Turbo', publisher: 'TurboSoft', sizeMb: 212, initial: 'installed' },
              { id: 'chrome', type: 'app', label: 'Google Chrome', publisher: 'Google LLC', sizeMb: 420, initial: 'installed' },
            ],
          },
        ],
      },
    ],
    goals: [
      { control: 'luz', op: 'eq', value: true, label: 'Ative a Luz noturna' },
      { control: 'escala', op: 'eq', value: '125', label: 'Escala em 125%' },
      { control: 'brilho', op: 'gte', value: 80, label: 'Brilho de pelo menos 80%' },
      { control: 'turbo', op: 'eq', value: 'removed', label: 'Desinstale o PC Turbo' },
    ],
  };
}

describe('SettingsChallenge', () => {
  it('altera toggle, select, slider, desinstala com confirmação e envia os valores', async () => {
    const submit = vi.fn<(answer: AnswerOfKind<'settings'>) => Evaluation>(() => OK);
    const user = userEvent.setup();
    render(<SettingsChallenge step={settingsStep()} locked={false} revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);

    const toggle = screen.getByRole('switch', { name: 'Luz noturna' });
    expect(toggle).not.toBeChecked();
    expect(screen.getByText('Desligado')).toBeInTheDocument();
    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(screen.getByText('Ligado')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Escala' }), '125');
    expect(screen.getByRole('combobox', { name: 'Escala' })).toHaveValue('125');

    const slider = screen.getByRole('slider', { name: 'Brilho' });
    fireEvent.change(slider, { target: { value: '85' } });
    expect(slider).toHaveAttribute('aria-valuetext', '85%');
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('3 de 4 concluídos')).toBeInTheDocument();

    // Navegação por teclado entre as seções.
    const firstTab = screen.getByRole('tab', { name: /Tela/ });
    firstTab.focus();
    await user.keyboard('{ArrowDown}');
    const appsTab = screen.getByRole('tab', { name: /Aplicativos instalados/ });
    expect(appsTab).toHaveAttribute('aria-selected', 'true');
    expect(appsTab).toHaveFocus();

    // Cancelar mantém o aplicativo.
    await user.click(screen.getByRole('button', { name: 'Desinstalar PC Turbo' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Desinstalar PC Turbo?' })).getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('button', { name: 'Desinstalar PC Turbo' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Desinstalar PC Turbo' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Desinstalar/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Desinstalar PC Turbo' })).not.toBeInTheDocument();
    expect(screen.getByText('Desinstalado')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('PC Turbo foi desinstalado.');
    expect(screen.getByText('4 de 4 concluídos')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(submit).toHaveBeenCalledWith({
      kind: 'settings',
      values: { brilho: 85, luz: true, escala: '125', turbo: 'removed', chrome: 'installed' },
    });
  });
});
