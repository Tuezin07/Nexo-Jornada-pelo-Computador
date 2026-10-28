import { Fragment } from 'react';
import type { KeyCombo as Combo } from '../../content/types';
import { comboKeys, type Platform } from '../../domain/sim/keys';

/** Renderiza "Ctrl+Shift+T" como teclas. Aceita "+" como tecla quando escrito "Ctrl++". */
export function KeyCombo({ combo }: { combo: string }) {
  const keys = combo
    .replace(/\+\+$/, '+PLUS')
    .split('+')
    .map((k) => (k === 'PLUS' ? '+' : k.trim()))
    .filter(Boolean);
  return (
    <span className="kbd-combo" aria-label={keys.join(' + ')}>
      {keys.map((k, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="plus" aria-hidden="true">
              +
            </span>
          )}
          <kbd>{k}</kbd>
        </Fragment>
      ))}
    </span>
  );
}

export function ComboKeys({ combo, platform }: { combo: Combo; platform: Platform }) {
  return <KeyCombo combo={comboKeys(combo, platform).join('+').replace(/\+\+$/, '++')} />;
}
