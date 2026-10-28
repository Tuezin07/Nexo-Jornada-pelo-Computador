import { describe, expect, it } from 'vitest';
import {
  comboEquals,
  comboFromEvent,
  expectedCombos,
  formatCombo,
  isCapturableInPage,
  isModifierOnly,
  keyLabel,
  normalizeKey,
  type KeyEventLike,
} from '../../src/domain/sim/keys';

const ev = (patch: Partial<KeyEventLike>): KeyEventLike => ({
  key: '',
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  ...patch,
});

describe('comboFromEvent', () => {
  it('usa `code` para letras: Shift (que muda `key` para maiúscula) não confunde', () => {
    expect(comboFromEvent(ev({ key: 'S', code: 'KeyS', ctrlKey: true, shiftKey: true }))).toEqual({ key: 's', ctrl: true, shift: true });
  });

  it('Alt que produz outro caractere ainda é reconhecido pela tecla física', () => {
    expect(comboFromEvent(ev({ key: 'å', code: 'KeyA', altKey: true }))).toEqual({ key: 'a', alt: true });
  });

  it('dígitos com Shift usam o número', () => {
    expect(comboFromEvent(ev({ key: '!', code: 'Digit1', shiftKey: true }))).toEqual({ key: '1', shift: true });
  });

  it('sem `code`, normaliza `key` e aliases', () => {
    expect(comboFromEvent(ev({ key: 'Escape' }))).toEqual({ key: 'escape' });
    expect(comboFromEvent(ev({ key: 'Esc' }))).toEqual({ key: 'escape' });
    expect(comboFromEvent(ev({ key: 'ArrowLeft', code: 'ArrowLeft', ctrlKey: true }))).toEqual({ key: 'arrowleft', ctrl: true });
    expect(comboFromEvent(ev({ key: 'F2', code: 'F2' }))).toEqual({ key: 'f2' });
    expect(comboFromEvent(ev({ key: 'C', metaKey: true }))).toEqual({ key: 'c', meta: true });
  });

  it('modificadores ausentes não aparecem como false', () => {
    const combo = comboFromEvent(ev({ key: 'a', code: 'KeyA' }));
    expect(Object.keys(combo)).toEqual(['key']);
  });

  it('tecla só de modificador', () => {
    const combo = comboFromEvent(ev({ key: 'Shift', code: 'ShiftLeft', shiftKey: true }));
    expect(combo).toEqual({ key: 'shift', shift: true });
    expect(isModifierOnly(combo)).toBe(true);
    expect(isModifierOnly({ key: 'c', ctrl: true })).toBe(false);
  });
});

describe('normalizeKey e comboEquals', () => {
  it('aliases', () => {
    expect(normalizeKey('Del')).toBe('delete');
    expect(normalizeKey('Space')).toBe(' ');
    expect(normalizeKey('Return')).toBe('enter');
    expect(normalizeKey('Cmd')).toBe('meta');
  });

  it('compara sem diferenciar maiúsculas nem aliases; undefined = false', () => {
    expect(comboEquals({ key: 'C', ctrl: true }, { key: 'c', ctrl: true, shift: false })).toBe(true);
    expect(comboEquals({ key: 'esc' }, { key: 'Escape' })).toBe(true);
    expect(comboEquals({ key: 'left', shift: true }, { key: 'arrowleft', shift: true })).toBe(true);
  });

  it('modificadores diferentes não são iguais', () => {
    expect(comboEquals({ key: 'c', ctrl: true }, { key: 'c', meta: true })).toBe(false);
    expect(comboEquals({ key: 'z', ctrl: true }, { key: 'z', ctrl: true, shift: true })).toBe(false);
    expect(comboEquals({ key: 'tab', alt: true }, { key: 'tab' })).toBe(false);
    expect(comboEquals({ key: 'c', ctrl: true }, { key: 'v', ctrl: true })).toBe(false);
  });
});

describe('formatCombo', () => {
  it('Windows: Win, Ctrl, Alt, Shift e depois a tecla', () => {
    expect(formatCombo({ key: 's', ctrl: true, shift: true }, 'windows')).toBe('Ctrl + Shift + S');
    expect(formatCombo({ key: 'e', meta: true }, 'windows')).toBe('Win + E');
    expect(formatCombo({ key: 'escape', ctrl: true, shift: true }, 'windows')).toBe('Ctrl + Shift + Esc');
    expect(formatCombo({ key: 'delete', ctrl: true, alt: true }, 'windows')).toBe('Ctrl + Alt + Delete');
    expect(formatCombo({ key: 's', meta: true, shift: true }, 'windows')).toBe('Win + Shift + S');
  });

  it('macOS: Control, Option, Shift, Cmd e depois a tecla', () => {
    expect(formatCombo({ key: 'c', meta: true }, 'mac')).toBe('Cmd + C');
    expect(formatCombo({ key: 'z', ctrl: true, alt: true, shift: true, meta: true }, 'mac')).toBe('Control + Option + Shift + Cmd + Z');
  });

  it('rótulos de teclas especiais', () => {
    expect(formatCombo({ key: 'arrowleft', ctrl: true }, 'windows')).toBe('Ctrl + ←');
    expect(formatCombo({ key: 'f2' }, 'windows')).toBe('F2');
    expect(formatCombo({ key: ' ', ctrl: true }, 'windows')).toBe('Ctrl + Espaço');
    expect(formatCombo({ key: 'shift', shift: true }, 'windows')).toBe('Shift');
    expect(keyLabel('printscreen')).toBe('PrtScn');
    expect(keyLabel('pageup')).toBe('PgUp');
    expect(keyLabel('f12')).toBe('F12');
  });
});

describe('expectedCombos', () => {
  const step = { combos: [{ key: 'c', ctrl: true }], mac: [{ key: 'c', meta: true }] };

  it('usa `mac` no macOS e `combos` no Windows', () => {
    expect(expectedCombos(step, 'mac')).toEqual([{ key: 'c', meta: true }]);
    expect(expectedCombos(step, 'windows')).toEqual([{ key: 'c', ctrl: true }]);
  });

  it('sem `mac` (ou vazio), usa `combos`', () => {
    expect(expectedCombos({ combos: step.combos }, 'mac')).toEqual(step.combos);
    expect(expectedCombos({ combos: step.combos, mac: [] }, 'mac')).toEqual(step.combos);
  });
});

describe('isCapturableInPage', () => {
  it.each([
    ['Ctrl+C', { key: 'c', ctrl: true }],
    ['Ctrl+V', { key: 'v', ctrl: true }],
    ['Ctrl+Z', { key: 'z', ctrl: true }],
    ['Ctrl+S', { key: 's', ctrl: true }],
    ['Ctrl+L', { key: 'l', ctrl: true }],
    ['Ctrl+←', { key: 'arrowleft', ctrl: true }],
    ['Shift+→', { key: 'arrowright', shift: true }],
    ['F2', { key: 'f2' }],
    ['Delete', { key: 'delete' }],
    ['Esc', { key: 'escape' }],
    ['Tab', { key: 'tab' }],
    ['Home', { key: 'home' }],
    ['Cmd+C', { key: 'c', meta: true }],
  ])('%s pode ser capturado na página', (_, combo) => {
    expect(isCapturableInPage(combo)).toBe(true);
  });

  it.each([
    ['Alt+Tab', { key: 'tab', alt: true }],
    ['Win+E', { key: 'e', meta: true }],
    ['Win+D', { key: 'd', meta: true }],
    ['Ctrl+W', { key: 'w', ctrl: true }],
    ['Ctrl+T', { key: 't', ctrl: true }],
    ['Ctrl+N', { key: 'n', ctrl: true }],
    ['Ctrl+Tab', { key: 'tab', ctrl: true }],
    ['Ctrl+J', { key: 'j', ctrl: true }],
    ['Ctrl+Shift+T', { key: 't', ctrl: true, shift: true }],
    ['Ctrl+Shift+Esc', { key: 'escape', ctrl: true, shift: true }],
    ['Ctrl+Alt+Delete', { key: 'delete', ctrl: true, alt: true }],
  ])('%s é reservado ao sistema/navegador', (_, combo) => {
    expect(isCapturableInPage(combo)).toBe(false);
  });
});
