/**
 * Painel de configurações simulado ("Configurações — NexoOS").
 * Os valores ficam neste componente; quem decide se os ajustes estão certos é o
 * motor, via `submit`.
 */
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { SettingControl } from '../../content/types';
import { checkSetting, initialSettingValues, type SettingValue } from '../../domain/evaluators';
import { Dialog } from '../components/common';
import { Icon, type IconName } from '../components/Icon';
import { RichText, plainText } from '../components/RichText';
import { SimGoalsPanel } from './FilesystemChallenge';
import type { ChallengeProps } from './types';
import './Settings.css';

type AppControl = Extract<SettingControl, { type: 'app' }>;

const NUMBER = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function formatValue(value: number, unit?: string): string {
  const number = NUMBER.format(value);
  if (!unit) return number;
  return unit === '%' || unit.startsWith('°') ? `${number}${unit}` : `${number} ${unit}`;
}

function formatMb(mb: number): string {
  return mb >= 1024 ? `${NUMBER.format(Math.round((mb / 1024) * 10) / 10)} GB` : `${NUMBER.format(mb)} MB`;
}

const PANEL_ICONS: [RegExp, IconName][] = [
  [/aplicativ|programa|apps/, 'layers'],
  [/acessib/, 'eye'],
  [/som|audio|áudio|volume|microfone/, 'volume'],
  [/tela|monitor|vídeo|video/, 'window'],
  [/rede|wi-?fi|internet/, 'wifi'],
  [/privacidade|seguran|antiv|firewall/, 'shield'],
  [/atualiza/, 'refresh'],
  [/energia|bateria/, 'bolt'],
  [/armazen|disco/, 'archive'],
  [/notifica/, 'info'],
  [/conta|usuário|usuario/, 'user'],
  [/teclado/, 'keyboard'],
];

function panelIcon(title: string): IconName {
  const lower = title.toLocaleLowerCase('pt-BR');
  return PANEL_ICONS.find(([pattern]) => pattern.test(lower))?.[1] ?? 'sliders';
}

export function SettingsChallenge({ step, locked, submit }: ChallengeProps<'settings'>) {
  const uid = useId();
  const [values, setValues] = useState<Record<string, SettingValue>>(() => initialSettingValues(step));
  const [panelId, setPanelId] = useState(step.panels[0]?.id ?? '');
  const [pendingUninstall, setPendingUninstall] = useState<AppControl | null>(null);
  const [status, setStatus] = useState<{ id: number; text: string } | null>(null);
  const statusSeq = useRef(0);
  const [shake, setShake] = useState(0);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const panelRef = useRef<HTMLDivElement>(null);
  const focusPanelAfterDialog = useRef(false);

  const panel = step.panels.find((p) => p.id === panelId) ?? step.panels[0];
  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelDomId = `${uid}-panel`;

  useEffect(() => {
    if (pendingUninstall === null && focusPanelAfterDialog.current) {
      focusPanelAfterDialog.current = false;
      panelRef.current?.focus();
    }
  }, [pendingUninstall]);

  const setValue = (id: string, value: SettingValue) => {
    if (locked) return;
    setValues((current) => ({ ...current, [id]: value }));
  };

  const selectPanel = (id: string, focus: boolean) => {
    setPanelId(id);
    if (focus) tabRefs.current.get(id)?.focus();
  };

  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const index = step.panels.findIndex((p) => p.id === panel?.id);
    let next: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % step.panels.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + step.panels.length) % step.panels.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = step.panels.length - 1;
    const target = next === null ? undefined : step.panels[next];
    if (!target) return;
    event.preventDefault();
    selectPanel(target.id, true);
  };

  const cancelUninstall = useCallback(() => setPendingUninstall(null), []);

  const confirmUninstall = () => {
    if (!pendingUninstall) return;
    setValue(pendingUninstall.id, 'removed');
    statusSeq.current += 1;
    setStatus({ id: statusSeq.current, text: `${plainText(pendingUninstall.label)} foi desinstalado.` });
    focusPanelAfterDialog.current = true;
    setPendingUninstall(null);
  };

  const verify = () => {
    if (locked) return;
    const evaluation = submit({ kind: 'settings', values });
    if (!evaluation.correct) setShake((n) => n + 1);
  };

  const crumbs = panel ? panel.title.split('>').map((part) => part.trim()) : [];

  return (
    <div className="challenge">
      <div className="sim-layout">
        <div className="sim-window st">
          <div className="sim-titlebar">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Configurações — NexoOS</span>
            <Icon name="gear" size={14} />
          </div>

          <div className="st-body">
            <div className="st-nav" role="tablist" aria-label="Seções das configurações" aria-orientation="vertical" onKeyDown={onTabKeyDown}>
              {step.panels.map((p) => {
                const selected = p.id === panel?.id;
                return (
                  <button
                    key={p.id}
                    ref={(node) => {
                      if (node) tabRefs.current.set(p.id, node);
                      else tabRefs.current.delete(p.id);
                    }}
                    type="button"
                    role="tab"
                    id={tabId(p.id)}
                    className="st-tab"
                    aria-selected={selected}
                    aria-controls={panelDomId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectPanel(p.id, false)}
                  >
                    <Icon name={panelIcon(p.title)} size={18} />
                    <span>
                      <RichText as="inline" text={p.title} />
                    </span>
                  </button>
                );
              })}
            </div>

            {panel && (
              <div ref={panelRef} className="st-panel" role="tabpanel" id={panelDomId} aria-labelledby={tabId(panel.id)} tabIndex={-1}>
                <h3 className="st-crumbs">
                  {crumbs.map((part, i) => (
                    <span key={i} className={i === crumbs.length - 1 ? 'current' : ''}>
                      {i > 0 && <Icon name="chevron-right" size={16} className="st-crumb-sep" />}
                      <RichText as="inline" text={part} />
                    </span>
                  ))}
                </h3>
                {panel.groups.map((group, gi) => {
                  const groupId = `${uid}-g-${panel.id}-${gi}`;
                  return (
                    <section key={gi} className="st-group" aria-labelledby={groupId}>
                      <h4 id={groupId} className="st-group-title">
                        <RichText as="inline" text={group.title} />
                      </h4>
                      {group.controls.map((control) => (
                        <ControlRow
                          key={control.id}
                          baseId={`${uid}-c-${control.id}`}
                          control={control}
                          value={values[control.id] ?? control.initial}
                          locked={locked}
                          onChange={(value) => setValue(control.id, value)}
                          onUninstall={setPendingUninstall}
                        />
                      ))}
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          <div className="sim-status st-status" role="status">
            {status ? (
              <span key={status.id}>
                <Icon name="check" size={14} /> {status.text}
              </span>
            ) : (
              <span className="faint">As alterações valem na hora, como no sistema de verdade.</span>
            )}
          </div>
        </div>

        <SimGoalsPanel
          goals={step.goals.map((goal) => ({ label: goal.label, done: checkSetting(goal, values) }))}
          locked={locked}
          onVerify={verify}
          shake={shake}
        />
      </div>

      {pendingUninstall && (
        <Dialog
          title={`Desinstalar ${plainText(pendingUninstall.label)}?`}
          onClose={cancelUninstall}
          actions={
            <>
              <button type="button" className="btn ghost" onClick={cancelUninstall}>
                Cancelar
              </button>
              <button type="button" className="btn danger" onClick={confirmUninstall}>
                <Icon name="trash" size={18} /> Desinstalar
              </button>
            </>
          }
        >
          <p className="muted">O aplicativo e os arquivos dele ({formatMb(pendingUninstall.sizeMb)}) serão removidos deste computador.</p>
          <p className="faint st-dialog-meta">Editor: {pendingUninstall.publisher}</p>
        </Dialog>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Controles
// ---------------------------------------------------------------------------

interface ControlRowProps {
  baseId: string;
  control: SettingControl;
  value: SettingValue;
  locked: boolean;
  onChange: (value: SettingValue) => void;
  onUninstall: (control: AppControl) => void;
}

function ControlRow({ baseId, control, value, locked, onChange, onUninstall }: ControlRowProps) {
  const descId = control.description ? `${baseId}-desc` : undefined;
  const description = control.description ? (
    <p id={descId} className="st-desc">
      <RichText as="inline" text={control.description} />
    </p>
  ) : null;

  switch (control.type) {
    case 'toggle': {
      const on = value === true;
      return (
        <div className="st-row">
          <div className="st-text">
            <label htmlFor={baseId} className="st-label">
              <RichText as="inline" text={control.label} />
            </label>
            {description}
          </div>
          <label className="switch st-switch">
            <input id={baseId} type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} disabled={locked} aria-describedby={descId} />
            <span className="track" aria-hidden="true" />
            <span className="state" aria-hidden="true">
              {on ? 'Ligado' : 'Desligado'}
            </span>
          </label>
        </div>
      );
    }
    case 'select':
      return (
        <div className="st-row">
          <div className="st-text">
            <label htmlFor={baseId} className="st-label">
              <RichText as="inline" text={control.label} />
            </label>
            {description}
          </div>
          <div className="st-select">
            <select id={baseId} className="select" value={String(value)} onChange={(e) => onChange(e.target.value)} disabled={locked} aria-describedby={descId}>
              {control.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {plainText(option.label)}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    case 'slider': {
      const numeric = typeof value === 'number' ? value : control.initial;
      const text = formatValue(numeric, control.unit);
      return (
        <div className="st-row">
          <div className="st-text">
            <label htmlFor={baseId} className="st-label">
              <RichText as="inline" text={control.label} />
            </label>
            {description}
          </div>
          <div className="st-slider">
            <span className="st-limit" aria-hidden="true">
              {formatValue(control.min, control.unit)}
            </span>
            <input
              id={baseId}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={numeric}
              onChange={(e) => onChange(Number(e.target.value))}
              disabled={locked}
              aria-valuetext={text}
              aria-describedby={descId}
            />
            <span className="st-limit" aria-hidden="true">
              {formatValue(control.max, control.unit)}
            </span>
            <span className="st-value" aria-hidden="true">
              {text}
            </span>
          </div>
        </div>
      );
    }
    case 'app': {
      const removed = value === 'removed';
      const name = plainText(control.label);
      return (
        <div className={`st-row st-app ${removed ? 'is-removed' : ''}`}>
          <span className="st-app-icon" aria-hidden="true">
            {name.charAt(0).toLocaleUpperCase('pt-BR')}
          </span>
          <div className="st-text">
            <span className="st-label" id={`${baseId}-name`}>
              <RichText as="inline" text={control.label} />
            </span>
            <span className="st-meta">
              {control.publisher} · {formatMb(control.sizeMb)}
            </span>
            {description}
          </div>
          {removed ? (
            <span className="chip st-removed">
              <Icon name="check" size={14} /> Desinstalado
            </span>
          ) : (
            <button
              type="button"
              className="btn small danger"
              onClick={() => onUninstall(control)}
              disabled={locked}
              aria-label={`Desinstalar ${name}`}
              aria-describedby={descId}
            >
              <Icon name="trash" size={16} /> Desinstalar
            </button>
          )}
        </div>
      );
    }
  }
}
