import { describe, expect, it } from 'vitest';
import type {
  ClassifyStep,
  DiagnosisStep,
  FilesystemStep,
  InspectStep,
  OrderStep,
  QuizStep,
  SettingsStep,
  ShortcutStep,
  TerminalStep,
  TypingStep,
} from '../../src/content/types';
import {
  checkSetting,
  evaluateClassify,
  evaluateDiagnosis,
  evaluateFilesystem,
  evaluateInspect,
  evaluateOrder,
  evaluateQuiz,
  evaluateSettings,
  evaluateShortcut,
  evaluateStep,
  evaluateTerminal,
  evaluateTyping,
  fsGoalStatus,
  initialSettingValues,
  replayDiagnosis,
  replayTyping,
  terminalGoalStatus,
} from '../../src/domain/evaluators';
import { createFs, emptyTrash, moveToTrash, openFile, resolvePath, restore, createFolder, move } from '../../src/domain/sim/fs';
import { createShell, runCommand, type ShellState } from '../../src/domain/sim/shell';
import { quizStep } from '../helpers/fixtures';

const base = { title: 't', prompt: 'p', hint: 'h', explanation: 'e', concept: 'teclas-essenciais' as const };

describe('quiz de escolha única', () => {
  const step = quizStep('q');

  it('alternativa correta', () => {
    expect(evaluateQuiz(step, { kind: 'quiz', selected: ['a'] })).toEqual({ correct: true, score: 1, mistakes: 0, messages: ['Isso mesmo.'] });
  });

  it('alternativa errada mostra o retorno específico', () => {
    expect(evaluateQuiz(step, { kind: 'quiz', selected: ['b'] })).toEqual({ correct: false, score: 0, mistakes: 1, messages: ['Não é isso.'] });
  });

  it('nada marcado não é erro', () => {
    const r = evaluateQuiz(step, { kind: 'quiz', selected: [] });
    expect(r).toMatchObject({ correct: false, mistakes: 0 });
    expect(r.messages[0]).toMatch(/Escolha/);
  });

  it('marcar mais de uma em escolha única não vale', () => {
    expect(evaluateQuiz(step, { kind: 'quiz', selected: ['a', 'b'] }).correct).toBe(false);
  });

  it('ids desconhecidos são ignorados', () => {
    expect(evaluateQuiz(step, { kind: 'quiz', selected: ['zzz'] }).mistakes).toBe(0);
  });
});

describe('quiz de múltipla escolha', () => {
  const step: QuizStep = {
    ...base,
    kind: 'quiz',
    id: 'qm',
    multiple: true,
    options: [
      { id: 'a', text: 'A', correct: true, feedback: 'A certa' },
      { id: 'b', text: 'B', correct: true, feedback: 'B certa' },
      { id: 'c', text: 'C', feedback: 'C errada' },
      { id: 'd', text: 'D', feedback: 'D errada' },
    ],
  };

  it('todas as corretas e nenhuma errada', () => {
    const r = evaluateQuiz(step, { kind: 'quiz', selected: ['b', 'a'] });
    expect(r).toMatchObject({ correct: true, score: 1, mistakes: 0 });
    expect(r.messages).toEqual(expect.arrayContaining(['A certa', 'B certa']));
  });

  it('faltando uma correta', () => {
    const r = evaluateQuiz(step, { kind: 'quiz', selected: ['a'] });
    expect(r).toMatchObject({ correct: false, score: 0.5, mistakes: 1 });
    expect(r.messages).toContain('Ainda falta marcar uma alternativa correta.');
  });

  it('todas as corretas mais uma errada', () => {
    const r = evaluateQuiz(step, { kind: 'quiz', selected: ['a', 'b', 'c'] });
    expect(r).toMatchObject({ correct: false, score: 0.5, mistakes: 1 });
    expect(r.messages).toEqual(['C errada']);
  });

  it('só erradas: nota limitada a zero', () => {
    const r = evaluateQuiz(step, { kind: 'quiz', selected: ['c', 'd'] });
    expect(r).toMatchObject({ correct: false, score: 0, mistakes: 4 });
    expect(r.messages).toContain('Ainda falta marcar 2 alternativas corretas.');
  });
});

describe('ordenação', () => {
  const step: OrderStep = {
    ...base,
    kind: 'order',
    id: 'o',
    items: ['1', '2', '3', '4'].map((id) => ({ id, text: id })),
  };

  it('ordem correta', () => {
    expect(evaluateOrder(step, { kind: 'order', order: ['1', '2', '3', '4'] })).toEqual({ correct: true, score: 1, mistakes: 0, messages: [] });
  });

  it('dois trocados: metade no lugar', () => {
    const r = evaluateOrder(step, { kind: 'order', order: ['2', '1', '3', '4'] });
    expect(r).toMatchObject({ correct: false, score: 0.5, mistakes: 1 });
    expect(r.messages[0]).toBe('2 de 4 etapas estão na posição certa.');
  });

  it('lista incompleta não é correta', () => {
    expect(evaluateOrder(step, { kind: 'order', order: ['1', '2', '3'] }).correct).toBe(false);
  });
});

describe('classificação', () => {
  const step: ClassifyStep = {
    ...base,
    kind: 'classify',
    id: 'c',
    buckets: [
      { id: 'in', label: 'Entrada' },
      { id: 'out', label: 'Saída' },
    ],
    items: [
      { id: 'mouse', text: 'Mouse', bucket: 'in', feedback: 'O mouse envia dados.' },
      { id: 'teclado', text: 'Teclado', bucket: 'in', feedback: 'O teclado envia dados.' },
      { id: 'monitor', text: 'Monitor', bucket: 'out', feedback: 'O monitor exibe.' },
      { id: 'caixa', text: 'Caixa de som', bucket: 'out', feedback: 'A caixa reproduz.' },
    ],
  };

  it('tudo no grupo certo', () => {
    const r = evaluateClassify(step, { kind: 'classify', placement: { mouse: 'in', teclado: 'in', monitor: 'out', caixa: 'out' } });
    expect(r).toMatchObject({ correct: true, score: 1, mistakes: 0 });
  });

  it('item sem grupo não conta como erro', () => {
    const r = evaluateClassify(step, { kind: 'classify', placement: { mouse: 'in', teclado: 'in', monitor: 'out' } });
    expect(r).toMatchObject({ correct: false, score: 0, mistakes: 0 });
    expect(r.messages[0]).toMatch(/um item sem grupo/);
  });

  it('item no grupo errado', () => {
    const r = evaluateClassify(step, { kind: 'classify', placement: { mouse: 'in', teclado: 'in', monitor: 'in', caixa: 'out' } });
    expect(r).toMatchObject({ correct: false, score: 0.75, mistakes: 1 });
    expect(r.messages[0]).toContain('O monitor exibe.');
  });
});

describe('atalho de teclado', () => {
  const copy: ShortcutStep = {
    ...base,
    kind: 'shortcut',
    id: 's',
    capture: 'real',
    combos: [{ key: 'c', ctrl: true }],
    mac: [{ key: 'c', meta: true }],
  };

  it('Windows: Ctrl+C', () => {
    expect(evaluateShortcut(copy, { kind: 'shortcut', pressed: [{ key: 'c', ctrl: true }], platform: 'windows' }).correct).toBe(true);
  });

  it('Windows: Win+C não é Ctrl+C', () => {
    const r = evaluateShortcut(copy, { kind: 'shortcut', pressed: [{ key: 'c', meta: true }], platform: 'windows' });
    expect(r).toMatchObject({ correct: false, mistakes: 1 });
    expect(r.messages[0]).toContain('Win + C');
  });

  it('macOS usa a combinação própria (Cmd+C)', () => {
    expect(evaluateShortcut(copy, { kind: 'shortcut', pressed: [{ key: 'c', meta: true }], platform: 'mac' }).correct).toBe(true);
    const r = evaluateShortcut(copy, { kind: 'shortcut', pressed: [{ key: 'c', ctrl: true }], platform: 'mac' });
    expect(r.correct).toBe(false);
    expect(r.messages[0]).toContain('Control + C');
  });

  it('sem `mac`, o macOS usa as combinações padrão', () => {
    const f2: ShortcutStep = { ...copy, mac: undefined, combos: [{ key: 'f2' }] };
    expect(evaluateShortcut(f2, { kind: 'shortcut', pressed: [{ key: 'F2' }], platform: 'mac' }).correct).toBe(true);
  });

  it('sequência: incompleta não é erro; tecla errada é', () => {
    const seq: ShortcutStep = { ...copy, mac: undefined, combos: [{ key: 'a', ctrl: true }, { key: 'c', ctrl: true }] };
    const partial = evaluateShortcut(seq, { kind: 'shortcut', pressed: [{ key: 'a', ctrl: true }], platform: 'windows' });
    expect(partial).toMatchObject({ correct: false, mistakes: 0 });
    const wrongSecond = evaluateShortcut(seq, { kind: 'shortcut', pressed: [{ key: 'a', ctrl: true }, { key: 'v', ctrl: true }], platform: 'windows' });
    expect(wrongSecond).toMatchObject({ correct: false, mistakes: 1 });
    const extra = evaluateShortcut(seq, {
      kind: 'shortcut',
      pressed: [{ key: 'a', ctrl: true }, { key: 'c', ctrl: true }, { key: 'v', ctrl: true }],
      platform: 'windows',
    });
    expect(extra.correct).toBe(false);
    const done = evaluateShortcut(seq, { kind: 'shortcut', pressed: [{ key: 'a', ctrl: true }, { key: 'c', ctrl: true }], platform: 'windows' });
    expect(done.correct).toBe(true);
  });
});

describe('digitação', () => {
  it('replayTyping no modo "para no erro": tecla errada não avança', () => {
    const r = replayTyping('abc', [
      { ch: 'a', t: 0 },
      { ch: 'x', t: 100 },
      { ch: 'b', t: 200 },
      { ch: 'c', t: 300 },
    ]);
    expect(r).toMatchObject({ position: 3, keystrokes: 4, mistakes: 1, accuracy: 0.75, durationMs: 300, completed: true });
  });

  it('palavras por minuto = (caracteres / 5) por minuto', () => {
    const text = 'abcdefghij';
    const log = [...text].map((ch, i) => ({ ch, t: i === 9 ? 12_000 : i * 1000 }));
    expect(replayTyping(text, log).wpm).toBe(10);
    const slow = [...text].map((ch, i) => ({ ch, t: i === 9 ? 60_000 : i * 1000 }));
    expect(replayTyping(text, slow).wpm).toBe(2);
  });

  it('erros repetidos na mesma posição continuam parados', () => {
    const r = replayTyping('ab', [
      { ch: 'a', t: 0 },
      { ch: 'x', t: 1 },
      { ch: 'y', t: 2 },
    ]);
    expect(r).toMatchObject({ position: 1, mistakes: 2, completed: false });
  });

  it('registro vazio', () => {
    expect(replayTyping('abc', [])).toEqual({ position: 0, keystrokes: 0, mistakes: 0, accuracy: 0, durationMs: 0, wpm: 0, completed: false });
  });

  const step: TypingStep = { ...base, kind: 'typing', id: 'd', text: 'abcd', minAccuracy: 0.8, targetWpm: 1000 };
  const keys = (s: string) => [...s].map((ch, i) => ({ ch, t: i * 500 }));

  it('texto incompleto não conclui', () => {
    const r = evaluateTyping(step, { kind: 'typing', log: keys('ab') });
    expect(r.correct).toBe(false);
    expect(r.messages[0]).toMatch(/Termine/);
    expect(r.metrics).toBeDefined();
  });

  it('precisão abaixo da meta reprova a etapa', () => {
    const r = evaluateTyping(step, { kind: 'typing', log: keys('axbxcd') }); // 4/6
    expect(r.correct).toBe(false);
    expect(r.mistakes).toBe(2);
    expect(r.score).toBeCloseTo(4 / 6);
  });

  it('precisão suficiente aprova; meta de velocidade só informa', () => {
    const r = evaluateTyping(step, { kind: 'typing', log: keys('abxcd') }); // 4/5 = 0,8
    expect(r.correct).toBe(true);
    expect(r.score).toBeCloseTo(0.8);
    expect(r.metrics).toMatchObject({ mistakes: 1, accuracy: 0.8, durationMs: 2000 });
    expect(r.messages.some((m) => m.includes('Meta de velocidade'))).toBe(true);
  });
});

describe('explorador de arquivos (objetivos)', () => {
  const seed = [
    {
      name: 'Documentos',
      type: 'folder' as const,
      children: [
        { name: 'a.pdf', type: 'file' as const },
        { name: 'b.pdf', type: 'file' as const },
        { name: 'nota.txt', type: 'file' as const },
      ],
    },
    { name: 'Downloads', type: 'folder' as const, children: [{ name: 'lixo.tmp', type: 'file' as const }] },
    { name: 'Sistema', type: 'folder' as const, children: [{ name: 'boot.ini', type: 'file' as const }] },
  ];
  const step: FilesystemStep = {
    ...base,
    kind: 'filesystem',
    id: 'fs',
    root: seed,
    startPath: '/',
    features: { createFolder: true, trash: true },
    protectedPaths: ['/Sistema/boot.ini'],
    goals: [
      { type: 'exists', path: '/Documentos/PDFs', nodeType: 'folder', label: 'Criar a pasta PDFs' },
      { type: 'countInFolder', path: '/Documentos/PDFs', extension: '.pdf', count: 2, label: 'Dois PDFs na pasta' },
      { type: 'notExists', path: '/Documentos/a.pdf', label: 'Tirar a.pdf da raiz' },
      { type: 'inTrash', name: 'LIXO.tmp', label: 'Lixo na Lixeira' },
      { type: 'opened', path: '/Documentos/nota.txt', label: 'Abrir a nota' },
    ],
  };

  function solve() {
    let fs = createFs(step.root, [], step.protectedPaths);
    const docs = resolvePath(fs, '/Documentos')!;
    const created = createFolder(fs, docs, 'PDFs');
    fs = created.state;
    fs = move(fs, [resolvePath(fs, '/Documentos/a.pdf')!, resolvePath(fs, '/Documentos/b.pdf')!], created.ok ? created.created! : '').state;
    fs = moveToTrash(fs, [resolvePath(fs, '/Downloads/lixo.tmp')!]).state;
    fs = openFile(fs, resolvePath(fs, '/Documentos/nota.txt')!).state;
    return fs;
  }

  it('estado inicial: nenhum objetivo cumprido', () => {
    const fs = createFs(step.root, [], step.protectedPaths);
    expect(fsGoalStatus(step, fs)).toEqual([false, false, false, false, false]);
    const r = evaluateFilesystem(step, { kind: 'filesystem', state: fs });
    expect(r.correct).toBe(false);
    expect(r.messages).toContain('Ainda falta: Criar a pasta PDFs');
  });

  it('todos os objetivos cumpridos', () => {
    const fs = solve();
    expect(fsGoalStatus(step, fs)).toEqual([true, true, true, true, true]);
    expect(evaluateFilesystem(step, { kind: 'filesystem', state: fs })).toMatchObject({ correct: true, score: 1, mistakes: 0 });
  });

  it('mexer em item protegido conta como erro e reduz a nota', () => {
    let fs = solve();
    fs = moveToTrash(fs, [resolvePath(fs, '/Sistema/boot.ini')!]).state;
    const r = evaluateFilesystem(step, { kind: 'filesystem', state: fs });
    expect(r).toMatchObject({ correct: true, mistakes: 1 });
    expect(r.score).toBeCloseTo(0.85);
    expect(r.messages.some((m) => m.includes('item protegido'))).toBe(true);
  });

  it('notInTrash e trashEmpty', () => {
    const goals: FilesystemStep = {
      ...step,
      goals: [
        { type: 'notInTrash', name: 'lixo.tmp', label: 'Restaurar' },
        { type: 'trashEmpty', label: 'Esvaziar' },
      ],
    };
    let fs = createFs(step.root);
    const lixo = resolvePath(fs, '/Downloads/lixo.tmp')!;
    fs = moveToTrash(fs, [lixo]).state;
    expect(fsGoalStatus(goals, fs)).toEqual([false, false]);
    fs = restore(fs, [lixo]).state;
    expect(fsGoalStatus(goals, fs)).toEqual([true, false]);
    fs = emptyTrash(fs).state;
    expect(fsGoalStatus(goals, fs)).toEqual([true, true]);
  });

  it('countInFolder não conta pasta na Lixeira', () => {
    const goal: FilesystemStep = { ...step, goals: [{ type: 'countInFolder', path: '/Documentos', extension: 'pdf', count: 2, label: 'x' }] };
    const fs = createFs(step.root);
    expect(fsGoalStatus(goal, fs)).toEqual([true]);
    const trashed = moveToTrash(fs, [resolvePath(fs, '/Documentos')!]).state;
    expect(fsGoalStatus(goal, trashed)).toEqual([false]);
  });
});

describe('terminal (objetivos)', () => {
  const step: TerminalStep = {
    ...base,
    kind: 'terminal',
    id: 't',
    root: [
      {
        name: 'Documentos',
        type: 'folder',
        children: [
          { name: 'a.txt', type: 'file' },
          { name: 'b.txt', type: 'file' },
        ],
      },
    ],
    startPath: '/',
    goals: [
      { type: 'cwd', path: '/Documentos', label: 'Entrar em Documentos' },
      { type: 'ran', command: 'ls', label: 'Listar' },
      { type: 'ran', command: 'ping', argIncludes: 'EXEMPLO.com', label: 'Pingar exemplo.com' },
      { type: 'exists', path: '/Documentos/Textos', nodeType: 'folder', label: 'Criar Textos' },
      { type: 'countInFolder', path: '/Documentos/Textos', extension: 'txt', count: 2, label: 'Mover os .txt' },
      { type: 'notExists', path: '/Documentos/a.txt', label: 'a.txt fora da raiz' },
    ],
  };

  function shell(): ShellState {
    return createShell(createFs(step.root), step.startPath);
  }

  function exec(state: ShellState, ...lines: string[]) {
    for (const line of lines) state = runCommand(state, line).state;
    return state;
  }

  it('estado inicial: nada cumprido', () => {
    expect(terminalGoalStatus(step, shell())).toEqual([false, false, false, false, false, false]);
  });

  it('todos os objetivos cumpridos', () => {
    const state = exec(shell(), 'cd Documentos', 'ls', 'ping exemplo.com', 'mkdir Textos', 'mv *.txt Textos');
    expect(terminalGoalStatus(step, state)).toEqual([true, true, true, true, true, true]);
    expect(evaluateTerminal(step, { kind: 'terminal', state })).toMatchObject({ correct: true, score: 1, messages: [] });
  });

  it('comando que falhou não cumpre o objetivo "ran"', () => {
    const offline = { ...shell(), network: { online: false, dnsWorking: true } };
    const state = exec(offline, 'ping exemplo.com');
    expect(state.history).toEqual([{ command: 'ping', args: ['exemplo.com'], ok: false }]);
    expect(terminalGoalStatus(step, state)[2]).toBe(false);
    const r = evaluateTerminal(step, { kind: 'terminal', state });
    expect(r.correct).toBe(false);
    expect(r.messages).toContain('Ainda falta: Pingar exemplo.com');
  });
});

describe('configurações', () => {
  const step: SettingsStep = {
    ...base,
    kind: 'settings',
    id: 'cfg',
    panels: [
      {
        id: 'p',
        title: 'Tela',
        groups: [
          {
            title: 'Geral',
            controls: [
              { id: 'brilho', type: 'slider', label: 'Brilho', min: 0, max: 100, step: 10, initial: 30 },
              { id: 'volume', type: 'slider', label: 'Volume', min: 0, max: 100, step: 10, initial: 80 },
              { id: 'tema', type: 'select', label: 'Tema', options: [{ value: 'claro', label: 'Claro' }, { value: 'escuro', label: 'Escuro' }], initial: 'claro' },
              { id: 'firewall', type: 'toggle', label: 'Firewall', initial: true },
              { id: 'jogo', type: 'app', label: 'Jogo', publisher: 'X', sizeMb: 10, initial: 'installed' },
            ],
          },
        ],
      },
    ],
    goals: [
      { control: 'brilho', op: 'gte', value: 70, label: 'Aumentar o brilho' },
      { control: 'volume', op: 'lte', value: 20, label: 'Baixar o volume' },
      { control: 'tema', op: 'eq', value: 'escuro', label: 'Tema escuro' },
      { control: 'jogo', op: 'eq', value: 'removed', label: 'Desinstalar o jogo' },
    ],
    forbidden: [{ control: 'firewall', op: 'eq', value: false, reason: 'Nunca desligue o firewall.' }],
  };

  it('valores iniciais vêm dos controles', () => {
    expect(initialSettingValues(step)).toEqual({ brilho: 30, volume: 80, tema: 'claro', firewall: true, jogo: 'installed' });
  });

  it('estado inicial: faltam todos os objetivos', () => {
    const r = evaluateSettings(step, { kind: 'settings', values: initialSettingValues(step) });
    expect(r).toMatchObject({ correct: false, mistakes: 4, score: 1 });
  });

  it('objetivos cumpridos nos limites (gte/lte inclusivos)', () => {
    const values = { ...initialSettingValues(step), brilho: 70, volume: 20, tema: 'escuro', jogo: 'removed' };
    expect(evaluateSettings(step, { kind: 'settings', values })).toMatchObject({ correct: true, score: 1, mistakes: 0, messages: [] });
  });

  it('estado proibido impede a conclusão e aparece primeiro', () => {
    const values = { ...initialSettingValues(step), brilho: 100, volume: 0, tema: 'escuro', jogo: 'removed', firewall: false };
    const r = evaluateSettings(step, { kind: 'settings', values });
    expect(r.correct).toBe(false);
    expect(r.score).toBeCloseTo(0.7);
    expect(r.mistakes).toBe(1);
    expect(r.messages[0]).toBe('Nunca desligue o firewall.');
  });

  it('gte/lte com valor não numérico é falso', () => {
    expect(checkSetting({ control: 'tema', op: 'gte', value: 1 }, { tema: 'escuro' })).toBe(false);
    expect(checkSetting({ control: 'nada', op: 'lte', value: 1 }, {})).toBe(false);
    expect(checkSetting({ control: 'brilho', op: 'gte', value: 69 }, { brilho: 69 })).toBe(true);
    expect(checkSetting({ control: 'brilho', op: 'gte', value: 70 }, { brilho: 69 })).toBe(false);
  });
});

describe('diagnóstico', () => {
  const step: DiagnosisStep = {
    ...base,
    kind: 'diagnosis',
    id: 'diag',
    symptom: 'Sem internet',
    startStage: 's1',
    stages: [
      {
        id: 's1',
        situation: 'Nada abre.',
        actions: [
          { id: 'cabo', label: 'Verificar o cabo', result: 'Solto!', quality: 'best', next: 's2' },
          { id: 'reiniciar-tudo', label: 'Reiniciar tudo', result: 'Nada', quality: 'good', next: 's2' },
          { id: 'esperar', label: 'Esperar', result: 'Nada mudou', quality: 'poor' },
          { id: 'formatar', label: 'Formatar o PC', result: 'Perdeu tudo', quality: 'harmful' },
        ],
      },
      {
        id: 's2',
        situation: 'Cabo ok.',
        actions: [
          { id: 'reconectar', label: 'Reconectar', result: 'Voltou', quality: 'best', resolves: true },
          { id: 'modem', label: 'Reiniciar modem', result: 'Voltou', quality: 'good', resolves: true },
        ],
      },
    ],
  };

  it('caminho ideal: resolvido com nota máxima', () => {
    const r = evaluateDiagnosis(step, { kind: 'diagnosis', trace: ['cabo', 'reconectar'] });
    expect(r).toMatchObject({ correct: true, score: 1, mistakes: 0, messages: [] });
    expect(r.metrics).toEqual({ best: 2, good: 0, poor: 0, harmful: 0 });
  });

  it('ação boa mas não ideal tem pequena penalidade', () => {
    const r = evaluateDiagnosis(step, { kind: 'diagnosis', trace: ['reiniciar-tudo', 'modem'] });
    expect(r.correct).toBe(true);
    expect(r.score).toBeCloseTo(0.8);
  });

  it('ações poor e harmful: continuam na fase, penalizam e avisam', () => {
    const replay = replayDiagnosis(step, ['esperar', 'formatar']);
    expect(replay).toEqual({ stageId: 's1', resolved: false, counts: { best: 0, good: 0, poor: 1, harmful: 1 }, triedInStage: ['esperar', 'formatar'] });

    const r = evaluateDiagnosis(step, { kind: 'diagnosis', trace: ['esperar', 'formatar', 'cabo', 'reconectar'] });
    expect(r.correct).toBe(true);
    expect(r.score).toBeCloseTo(0.5);
    expect(r.mistakes).toBe(2);
    expect(r.messages.some((m) => m.includes('arriscada'))).toBe(true);
    expect(r.messages.some((m) => m.includes('não ajudaram'))).toBe(true);
  });

  it('repetir uma ação já tentada na fase não conta de novo', () => {
    const replay = replayDiagnosis(step, ['esperar', 'esperar', 'esperar']);
    expect(replay.counts.poor).toBe(1);
  });

  it('ação de outra fase é ignorada; ações depois de resolver também', () => {
    const replay = replayDiagnosis(step, ['reconectar', 'cabo', 'reconectar', 'formatar']);
    expect(replay.resolved).toBe(true);
    expect(replay.counts).toEqual({ best: 2, good: 0, poor: 0, harmful: 0 });
  });

  it('não resolvido não conclui', () => {
    const r = evaluateDiagnosis(step, { kind: 'diagnosis', trace: ['cabo'] });
    expect(r.correct).toBe(false);
    expect(r.messages[0]).toMatch(/ainda não foi resolvido/);
  });

  it('muitas ações ruins: nota nunca negativa', () => {
    const r = evaluateDiagnosis(step, { kind: 'diagnosis', trace: ['formatar', 'esperar', 'reiniciar-tudo', 'modem'] });
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeCloseTo(1 - 0.1 - 0.15 - 0.35 - 0.1);
  });
});

describe('inspeção', () => {
  const step: InspectStep = {
    ...base,
    kind: 'inspect',
    id: 'insp',
    artifact: 'email',
    minFlags: 2,
    parts: [
      { id: 'de', field: 'De', text: 'banco@bannco.com', suspicious: true, explanation: 'Domínio falso.' },
      { id: 'link', field: 'Link', text: 'http://bit.ly/x', suspicious: true, explanation: 'Link encurtado.' },
      { id: 'saudacao', field: 'Mensagem', text: 'Olá, cliente', suspicious: false, explanation: 'Saudação comum, não é sinal de golpe.' },
      { id: 'urgencia', field: 'Assunto', text: 'URGENTE', suspicious: true, explanation: 'Pressão.' },
    ],
    verdict: {
      question: 'É golpe?',
      options: [
        { id: 'golpe', text: 'Golpe', correct: true, feedback: 'Certo.' },
        { id: 'legitimo', text: 'Legítimo', feedback: 'Repare no remetente.' },
      ],
    },
  };

  it('sinais suficientes e veredito certo', () => {
    const r = evaluateInspect(step, { kind: 'inspect', flagged: ['de', 'link'], verdict: 'golpe' });
    expect(r).toMatchObject({ correct: true, mistakes: 0, messages: [] });
    expect(r.score).toBeCloseTo((2 / 3) * 0.6 + 0.4);
  });

  it('todos os sinais e veredito certo: nota máxima', () => {
    const r = evaluateInspect(step, { kind: 'inspect', flagged: ['de', 'link', 'urgencia'], verdict: 'golpe' });
    expect(r.score).toBeCloseTo(1);
  });

  it('falso positivo conta como erro e explica, mas não impede a conclusão', () => {
    const r = evaluateInspect(step, { kind: 'inspect', flagged: ['de', 'link', 'saudacao'], verdict: 'golpe' });
    expect(r.correct).toBe(true);
    expect(r.mistakes).toBe(1);
    expect(r.messages).toContain('Mensagem: Saudação comum, não é sinal de golpe.');
    expect(r.score).toBeCloseTo((2 / 3) * 0.6 + 0.4 - 0.1);
  });

  it('poucos sinais não concluem', () => {
    const r = evaluateInspect(step, { kind: 'inspect', flagged: ['de', 'saudacao'], verdict: 'golpe' });
    expect(r.correct).toBe(false);
    expect(r.mistakes).toBe(2);
    expect(r.messages[0]).toMatch(/pelo menos 2/);
  });

  it('veredito errado não conclui e mostra o retorno da alternativa', () => {
    const r = evaluateInspect(step, { kind: 'inspect', flagged: ['de', 'link', 'urgencia'], verdict: 'legitimo' });
    expect(r.correct).toBe(false);
    expect(r.mistakes).toBe(1);
    expect(r.messages).toContain('Repare no remetente.');
    expect(r.score).toBeCloseTo(0.6);
  });

  it('sem veredito', () => {
    const r = evaluateInspect(step, { kind: 'inspect', flagged: ['de', 'link'], verdict: null });
    expect(r.correct).toBe(false);
    expect(r.messages).toContain('Dê o seu veredito.');
  });
});

describe('evaluateStep', () => {
  it('encaminha ao avaliador do formato', () => {
    expect(evaluateStep(quizStep('q'), { kind: 'quiz', selected: ['a'] }).correct).toBe(true);
  });

  it('resposta de outro formato é incompatível', () => {
    expect(evaluateStep(quizStep('q'), { kind: 'diagnosis', trace: [] })).toEqual({
      correct: false,
      score: 0,
      mistakes: 0,
      messages: ['Resposta incompatível com a etapa.'],
    });
  });
});
