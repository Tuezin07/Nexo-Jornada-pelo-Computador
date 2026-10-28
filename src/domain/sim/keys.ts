/**
 * Normalização e formatação de combinações de teclas.
 */
import type { KeyCombo } from '../../content/types';

export type Platform = 'windows' | 'mac';

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  del: 'delete',
  spacebar: ' ',
  space: ' ',
  left: 'arrowleft',
  right: 'arrowright',
  up: 'arrowup',
  down: 'arrowdown',
  os: 'meta',
  win: 'meta',
  command: 'meta',
  cmd: 'meta',
  control: 'ctrl',
  option: 'alt',
  return: 'enter',
};

export const MODIFIER_KEYS = new Set(['ctrl', 'shift', 'alt', 'meta', 'altgraph', 'capslock', 'fn']);

export function normalizeKey(key: string): string {
  const lower = key.length === 1 ? key.toLowerCase() : key.toLowerCase();
  return KEY_ALIASES[lower] ?? lower;
}

export interface KeyEventLike {
  key: string;
  code?: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

/**
 * Converte um evento de teclado numa combinação. Usa `code` para letras quando
 * disponível, para que Shift/Alt (que mudam `key`) não confundam a comparação.
 */
export function comboFromEvent(event: KeyEventLike): KeyCombo {
  let key = normalizeKey(event.key);
  if (event.code && /^Key[A-Z]$/.test(event.code)) key = event.code.slice(3).toLowerCase();
  else if (event.code && /^Digit\d$/.test(event.code)) key = event.code.slice(5);
  else if (event.code === 'Semicolon' && key === 'ç') key = 'ç';
  const combo: KeyCombo = { key };
  if (event.ctrlKey) combo.ctrl = true;
  if (event.shiftKey) combo.shift = true;
  if (event.altKey) combo.alt = true;
  if (event.metaKey) combo.meta = true;
  return combo;
}

export function isModifierOnly(combo: KeyCombo): boolean {
  return MODIFIER_KEYS.has(combo.key);
}

export function comboEquals(a: KeyCombo, b: KeyCombo): boolean {
  return (
    normalizeKey(a.key) === normalizeKey(b.key) &&
    Boolean(a.ctrl) === Boolean(b.ctrl) &&
    Boolean(a.shift) === Boolean(b.shift) &&
    Boolean(a.alt) === Boolean(b.alt) &&
    Boolean(a.meta) === Boolean(b.meta)
  );
}

const KEY_LABELS: Record<string, string> = {
  ' ': 'Espaço',
  escape: 'Esc',
  enter: 'Enter',
  tab: 'Tab',
  backspace: 'Backspace',
  delete: 'Delete',
  arrowleft: '←',
  arrowright: '→',
  arrowup: '↑',
  arrowdown: '↓',
  home: 'Home',
  end: 'End',
  printscreen: 'PrtScn',
  pageup: 'PgUp',
  pagedown: 'PgDn',
  capslock: 'Caps Lock',
  insert: 'Insert',
};

export function keyLabel(key: string): string {
  const normalized = normalizeKey(key);
  if (KEY_LABELS[normalized]) return KEY_LABELS[normalized]!;
  if (/^f\d{1,2}$/.test(normalized)) return normalized.toUpperCase();
  return normalized.length === 1 ? normalized.toUpperCase() : normalized[0]!.toUpperCase() + normalized.slice(1);
}

/** Lista das teclas de uma combinação, na ordem convencional. */
export function comboKeys(combo: KeyCombo, platform: Platform): string[] {
  const keys: string[] = [];
  if (platform === 'mac') {
    if (combo.ctrl) keys.push('Control');
    if (combo.alt) keys.push('Option');
    if (combo.shift) keys.push('Shift');
    if (combo.meta) keys.push('Cmd');
  } else {
    if (combo.meta) keys.push('Win');
    if (combo.ctrl) keys.push('Ctrl');
    if (combo.alt) keys.push('Alt');
    if (combo.shift) keys.push('Shift');
  }
  if (!MODIFIER_KEYS.has(normalizeKey(combo.key))) keys.push(keyLabel(combo.key));
  return keys;
}

export function formatCombo(combo: KeyCombo, platform: Platform): string {
  return comboKeys(combo, platform).join(' + ');
}

/** Combinação esperada para a plataforma do jogador. */
export function expectedCombos(step: { combos: KeyCombo[]; mac?: KeyCombo[] }, platform: Platform): KeyCombo[] {
  return platform === 'mac' && step.mac && step.mac.length > 0 ? step.mac : step.combos;
}

/**
 * Atalhos que a página pode interceptar com segurança na área de prática
 * (o navegador entrega o evento e preventDefault funciona).
 */
export function isCapturableInPage(combo: KeyCombo, platform?: Platform): boolean {
  const key = normalizeKey(combo.key);
  const primary = combo.ctrl || combo.meta;
  if (combo.alt && key === 'tab') return false;
  // No Windows a tecla Win é do sistema (Win+V, Win+L, Win+E...): nunca chega à página.
  if (platform === 'windows' && combo.meta) return false;
  if (combo.meta && !['c', 'v', 'x', 'z', 'y', 'a', 's', 'f', 'p', 'b', 'i', 'u', 'l', 'arrowleft', 'arrowright'].includes(key)) {
    return false;
  }
  if (primary && ['w', 't', 'n', 'tab', 'q', 'h', 'j'].includes(key)) return false;
  if (primary && combo.shift && ['t', 'n', 'w', 'escape', 'delete'].includes(key)) return false;
  if (combo.ctrl && combo.alt && key === 'delete') return false;
  return true;
}
