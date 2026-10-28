/** Pequenos componentes visuais reutilizados pelas telas. */
import { useEffect, useRef, type ReactNode } from 'react';
import type { CategoryId, Difficulty, SectorId } from '../../content/types';
import { getCategory } from '../../content/categories';
import { getSector } from '../../content/sectors';
import { CATEGORY_ICON, DIFFICULTY_LABEL, SECTOR_ICON, sectorStyle } from '../lib/format';
import { Icon, type IconName } from './Icon';

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`logo logo-${size}`} aria-label="Nexo">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
        <path d="M16 46V18l16 20V18M40 18h10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y="40" width="10" height="6" rx="1.5" className="logo-cursor" />
      </svg>
      <span className="logo-word" aria-hidden="true">
        NEXO
      </span>
    </span>
  );
}

export function DifficultyPips({ value, showLabel = true }: { value: Difficulty; showLabel?: boolean }) {
  return (
    <span className="difficulty" title={`Dificuldade: ${DIFFICULTY_LABEL[value]}`}>
      <span className="pips" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <i key={n} className={n <= value ? 'on' : ''} />
        ))}
      </span>
      {showLabel ? <span>{DIFFICULTY_LABEL[value]}</span> : <span className="visually-hidden">{DIFFICULTY_LABEL[value]}</span>}
    </span>
  );
}

export function SectorChip({ sector }: { sector: SectorId }) {
  return (
    <span className="chip sector" style={sectorStyle(sector)}>
      <Icon name={SECTOR_ICON[sector]} size={14} /> {getSector(sector).name}
    </span>
  );
}

export function CategoryChip({ category }: { category: CategoryId }) {
  return (
    <span className="chip">
      <Icon name={CATEGORY_ICON[category]} size={14} /> {getCategory(category).short}
    </span>
  );
}

export function XpBar({ value, label }: { value: number; label: string }) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div
      className="meter xp"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <span style={{ '--value': `${clamped * 100}%` } as React.CSSProperties} />
    </div>
  );
}

export function Meter({ value, label, color }: { value: number; label: string; color?: string }) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div className="meter" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(clamped * 100)}>
      <span style={{ '--value': `${clamped * 100}%`, ...(color ? { '--meter-color': color } : {}) } as React.CSSProperties} />
    </div>
  );
}

export function EmptyState({ icon = 'info', title, children }: { icon?: IconName; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <Icon name={icon} size={28} />
      <strong>{title}</strong>
      {children && <div>{children}</div>}
    </div>
  );
}

interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions: ReactNode;
  labelledBy?: string;
}

/** Diálogo modal acessível: foco preso, Esc fecha, foco devolvido ao fechar. */
export function Dialog({ title, onClose, children, actions }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Guardado em ref para o efeito rodar só na montagem, mesmo com onClose instável.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const focusables = () =>
      node ? [...node.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.hasAttribute('disabled')) : [];
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === 'Tab') {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, []);
  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={ref}>
        <h2 id="dialog-title">{title}</h2>
        {children}
        <div className="dialog-actions">{actions}</div>
      </div>
    </div>
  );
}

export function StatTile({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: IconName }) {
  return (
    <div className="stat-tile">
      <div className="stat-label">
        {icon && <Icon name={icon} size={16} />} {label}
      </div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}
