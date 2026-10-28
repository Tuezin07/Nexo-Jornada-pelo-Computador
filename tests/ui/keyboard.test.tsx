import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ShortcutStep, TypingStep } from '../../src/content/types';
import {
  evaluateShortcut,
  evaluateTyping,
  replayTyping,
  type AnswerOfKind,
  type Evaluation,
} from '../../src/domain/evaluators';
import { ShortcutChallenge } from '../../src/ui/challenges/ShortcutChallenge';
import { TypingChallenge } from '../../src/ui/challenges/TypingChallenge';
import { VirtualKeyboard } from '../../src/ui/challenges/VirtualKeyboard';

afterEach(cleanup);

function shortcutStep(extra: Partial<ShortcutStep> = {}): ShortcutStep {
  return {
    kind: 'shortcut',
    id: 'atalho-teste',
    title: 'Copiar',
    prompt: 'Copie o texto.',
    hint: 'Ctrl e a inicial de copiar.',
    explanation: 'Ctrl+C copia.',
    concept: 'area-transferencia',
    capture: 'real',
    combos: [{ key: 'c', ctrl: true }],
    mac: [{ key: 'c', meta: true }],
    practiceText: 'Reunião: Rua das Acácias, 120.',
    ...extra,
  };
}

function typingStep(extra: Partial<TypingStep> = {}): TypingStep {
  return {
    kind: 'typing',
    id: 'digitacao-teste',
    title: 'Digitação',
    prompt: 'Digite o texto.',
    hint: 'Com calma.',
    explanation: 'Precisão primeiro.',
    concept: 'digitacao-precisao',
    text: 'ab c',
    minAccuracy: 0.5,
    ...extra,
  };
}

function renderShortcut(step: ShortcutStep, platform: 'windows' | 'mac' = 'windows') {
  const submit = vi.fn((answer: AnswerOfKind<'shortcut'>): Evaluation => evaluateShortcut(step, answer));
  const utils = render(
    <ShortcutChallenge step={step} locked={false} revealed={false} submit={submit} platform={platform} preferVirtualKeyboard={false} />,
  );
  const area = screen.getByRole('application', { name: /Área de prática de atalhos/ });
  return { ...utils, submit, area };
}

describe('ShortcutChallenge (captura real)', () => {
  it('captura Ctrl+C dentro da área, cancela o evento e envia a combinação', () => {
    const { submit, area } = renderShortcut(shortcutStep());
    act(() => area.focus());
    const notCanceled = fireEvent.keyDown(area, { key: 'c', code: 'KeyC', ctrlKey: true });
    expect(notCanceled).toBe(false);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({ kind: 'shortcut', pressed: [{ key: 'c', ctrl: true }], platform: 'windows' });
    expect(submit.mock.results[0]?.value).toMatchObject({ correct: true });
  });

  it('não captura teclas fora da área de prática', () => {
    const { submit } = renderShortcut(shortcutStep());
    const notCanceled = fireEvent.keyDown(document.body, { key: 'c', code: 'KeyC', ctrlKey: true });
    expect(notCanceled).toBe(true);
    expect(submit).not.toHaveBeenCalled();
  });

  it('ignora teclas só de modificador e envia a sequência até o erro', () => {
    const { submit, area } = renderShortcut(shortcutStep());
    fireEvent.keyDown(area, { key: 'Control', code: 'ControlLeft', ctrlKey: true });
    expect(submit).not.toHaveBeenCalled();
    fireEvent.keyDown(area, { key: 'v', code: 'KeyV', ctrlKey: true });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenLastCalledWith({ kind: 'shortcut', pressed: [{ key: 'v', ctrl: true }], platform: 'windows' });
    expect(submit.mock.results[0]?.value).toMatchObject({ correct: false, mistakes: 1 });
    expect(screen.getByText(/Não é a combinação pedida/)).toBeInTheDocument();
  });

  it('avança numa sequência de 2 passos e só envia ao completar', () => {
    const step = shortcutStep({
      combos: [
        { key: 'arrowright', ctrl: true },
        { key: 'arrowright', ctrl: true, shift: true },
      ],
      mac: undefined,
      practiceText: 'Relatório preliminar de vendas da equipe regional.',
    });
    const { submit, area } = renderShortcut(step);
    expect(screen.getByText('Passo 1 de 2')).toBeInTheDocument();

    fireEvent.keyDown(area, { key: 'ArrowRight', code: 'ArrowRight', ctrlKey: true });
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText('Passo 2 de 2')).toBeInTheDocument();

    const notCanceled = fireEvent.keyDown(area, { key: 'ArrowRight', code: 'ArrowRight', ctrlKey: true, shiftKey: true });
    expect(notCanceled).toBe(false);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({
      kind: 'shortcut',
      pressed: [
        { key: 'arrowright', ctrl: true },
        { key: 'arrowright', ctrl: true, shift: true },
      ],
      platform: 'windows',
    });
    expect(submit.mock.results[0]?.value).toMatchObject({ correct: true });
    // Efeito simulado: a segunda palavra ficou selecionada.
    expect(screen.getAllByText(/Selecionado: “preliminar/).length).toBeGreaterThan(0);
  });

  it('reinicia a sequência após um erro no meio', () => {
    const step = shortcutStep({
      combos: [
        { key: 'a', ctrl: true },
        { key: 'b', ctrl: true },
      ],
      mac: undefined,
    });
    const { submit, area } = renderShortcut(step);
    fireEvent.keyDown(area, { key: 'a', code: 'KeyA', ctrlKey: true });
    fireEvent.keyDown(area, { key: 'i', code: 'KeyI', ctrlKey: true });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenLastCalledWith({
      kind: 'shortcut',
      pressed: [
        { key: 'a', ctrl: true },
        { key: 'i', ctrl: true },
      ],
      platform: 'windows',
    });
    expect(screen.getByText('Passo 1 de 2')).toBeInTheDocument();

    fireEvent.keyDown(area, { key: 'a', code: 'KeyA', ctrlKey: true });
    fireEvent.keyDown(area, { key: 'b', code: 'KeyB', ctrlKey: true });
    expect(submit).toHaveBeenCalledTimes(2);
    expect(submit.mock.results[1]?.value).toMatchObject({ correct: true });
  });

  it('deixa o Tab navegar quando ele não faz parte do atalho, e o captura quando faz', () => {
    const { submit, area, unmount } = renderShortcut(shortcutStep());
    expect(fireEvent.keyDown(area, { key: 'Tab', code: 'Tab' })).toBe(true);
    expect(submit).not.toHaveBeenCalled();
    unmount();

    const tabStep = shortcutStep({ combos: [{ key: 'tab' }], mac: undefined, practiceText: 'Nome: Ana | E-mail: ____' });
    const second = renderShortcut(tabStep);
    expect(fireEvent.keyDown(second.area, { key: 'Tab', code: 'Tab' })).toBe(false);
    expect(second.submit).toHaveBeenCalledWith({ kind: 'shortcut', pressed: [{ key: 'tab' }], platform: 'windows' });
  });

  it('usa a combinação do macOS quando a plataforma é mac', () => {
    const { submit, area } = renderShortcut(shortcutStep(), 'mac');
    fireEvent.keyDown(area, { key: 'c', code: 'KeyC', metaKey: true });
    expect(submit).toHaveBeenCalledWith({ kind: 'shortcut', pressed: [{ key: 'c', meta: true }], platform: 'mac' });
    expect(submit.mock.results[0]?.value).toMatchObject({ correct: true });
  });

  it('não captura nada quando a etapa está concluída', () => {
    const step = shortcutStep();
    const submit = vi.fn((answer: AnswerOfKind<'shortcut'>): Evaluation => evaluateShortcut(step, answer));
    render(<ShortcutChallenge step={step} locked revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);
    expect(screen.queryByRole('application')).not.toBeInTheDocument();
    expect(screen.getByText('Atalho registrado')).toBeInTheDocument();
  });
});

describe('ShortcutChallenge (teclado virtual)', () => {
  it('monta Win+V no teclado virtual com a tecla Windows, inclusive no macOS', async () => {
    const user = userEvent.setup();
    const step = shortcutStep({
      capture: 'virtual',
      combos: [{ key: 'v', meta: true }],
      mac: undefined,
      windowsOnly: true,
      practiceText: undefined,
    });
    const submit = vi.fn((answer: AnswerOfKind<'shortcut'>): Evaluation => evaluateShortcut(step, answer));
    render(<ShortcutChallenge step={step} locked={false} revealed={false} submit={submit} platform="mac" preferVirtualKeyboard={false} />);
    expect(screen.getByText('Atalho do Windows')).toBeInTheDocument();
    expect(screen.queryByRole('application')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tecla Windows' }));
    await user.click(screen.getByRole('button', { name: 'V' }));
    expect(submit).toHaveBeenCalledWith({ kind: 'shortcut', pressed: [{ key: 'v', meta: true }], platform: 'windows' });
    expect(submit.mock.results[0]?.value).toMatchObject({ correct: true });
  });
});

describe('VirtualKeyboard', () => {
  it('trava o Ctrl e emite { key: "t", ctrl: true } ao clicar em T', async () => {
    const user = userEvent.setup();
    const onCombo = vi.fn();
    render(<VirtualKeyboard platform="windows" onCombo={onCombo} />);
    const ctrl = screen.getByRole('button', { name: 'Control' });
    await user.click(ctrl);
    expect(ctrl).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'T' }));
    expect(onCombo).toHaveBeenCalledTimes(1);
    expect(onCombo).toHaveBeenCalledWith({ key: 't', ctrl: true });
    // O modificador é solto depois da tecla comum.
    expect(ctrl).toHaveAttribute('aria-pressed', 'false');
  });

  it('limpa modificadores e mostra Option/Command no macOS', async () => {
    const user = userEvent.setup();
    const onCombo = vi.fn();
    render(<VirtualKeyboard platform="mac" onCombo={onCombo} />);
    const cmd = screen.getByRole('button', { name: 'Command' });
    await user.click(cmd);
    await user.click(screen.getByRole('button', { name: 'Shift' }));
    await user.click(screen.getByRole('button', { name: /Limpar modificadores/ }));
    expect(cmd).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Option' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Seta para a esquerda' }));
    expect(onCombo).toHaveBeenCalledWith({ key: 'arrowleft' });
  });

  it('navega entre as teclas com as setas (um único ponto de Tab)', async () => {
    const user = userEvent.setup();
    render(<VirtualKeyboard platform="windows" onCombo={() => {}} />);
    const esc = screen.getByRole('button', { name: 'Escape' });
    expect(esc).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'F1' })).toHaveAttribute('tabindex', '-1');
    act(() => esc.focus());
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'F1' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/^\d$/);
  });
});

describe('TypingChallenge', () => {
  it('registra cada caractere, para no erro e envia um log completo com 1 erro', () => {
    const step = typingStep();
    const submit = vi.fn((answer: AnswerOfKind<'typing'>): Evaluation => evaluateTyping(step, answer));
    render(<TypingChallenge step={step} locked={false} revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);
    const input = screen.getByLabelText(/Campo de digitação/);

    for (const ch of ['a', 'x', 'b', ' ', 'c']) {
      fireEvent.input(input, { target: { value: ch } });
      expect(input).toHaveValue('');
    }

    expect(submit).toHaveBeenCalledTimes(1);
    const answer = submit.mock.calls[0]![0];
    expect(answer.kind).toBe('typing');
    expect(answer.log.map((k) => k.ch).join('')).toBe('axb c');
    const replay = replayTyping(step.text, answer.log);
    expect(replay.completed).toBe(true);
    expect(replay.mistakes).toBe(1);
    expect(submit.mock.results[0]?.value).toMatchObject({ correct: true });
  });

  it('mostra o erro sem avançar e ignora entrada durante a composição de acentos', () => {
    const step = typingStep({ text: 'á b' });
    const submit = vi.fn((answer: AnswerOfKind<'typing'>): Evaluation => evaluateTyping(step, answer));
    render(<TypingChallenge step={step} locked={false} revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);
    const input = screen.getByLabelText(/Campo de digitação/) as HTMLInputElement;

    fireEvent.input(input, { target: { value: 'q' } });
    expect(screen.getByText(/Tecla errada/)).toBeInTheDocument();
    expect(screen.getByText('0/3 caracteres')).toBeInTheDocument();

    fireEvent.compositionStart(input);
    fireEvent.input(input, { target: { value: '´' } });
    expect(screen.getByText('0/3 caracteres')).toBeInTheDocument();
    input.value = 'á';
    fireEvent.compositionEnd(input);
    expect(input.value).toBe('');
    expect(screen.getByText('1/3 caracteres')).toBeInTheDocument();

    fireEvent.input(input, { target: { value: ' b' } });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(replayTyping(step.text, submit.mock.calls[0]![0].log)).toMatchObject({ completed: true, mistakes: 1 });
  });

  it('oferece "Tentar de novo" quando a precisão fica abaixo da meta e reinicia o texto', async () => {
    const user = userEvent.setup();
    const step = typingStep({ text: 'ab', minAccuracy: 0.95 });
    const submit = vi.fn((answer: AnswerOfKind<'typing'>): Evaluation => evaluateTyping(step, answer));
    render(<TypingChallenge step={step} locked={false} revealed={false} submit={submit} platform="windows" preferVirtualKeyboard={false} />);
    const input = screen.getByLabelText(/Campo de digitação/);
    for (const ch of ['a', 'z', 'b']) fireEvent.input(input, { target: { value: ch } });
    expect(submit.mock.results[0]?.value).toMatchObject({ correct: false });

    await user.click(screen.getByRole('button', { name: /Tentar de novo/ }));
    expect(screen.getByText('0/2 caracteres')).toBeInTheDocument();
    for (const ch of ['a', 'b']) fireEvent.input(input, { target: { value: ch } });
    expect(submit).toHaveBeenCalledTimes(2);
    expect(submit.mock.calls[1]![0].log.map((k) => k.ch).join('')).toBe('ab');
    expect(submit.mock.results[1]?.value).toMatchObject({ correct: true });
  });
});
