import type { MissionDefinition } from '../../content/types';
import type { Catalog } from '../../domain/catalog';
import type { GameState } from '../../domain/state';
import { missingPrerequisites, type MissionStatus } from '../../domain/unlock';
import { maxFirstCompletionXp, missionBaseXp } from '../../domain/xp';
import { getSector } from '../../content/sectors';
import { href } from '../../app/router';
import { Icon } from './Icon';
import { CategoryChip, DifficultyPips } from './common';
import { pct, sectorStyle } from '../lib/format';

const STATUS_LABEL: Record<MissionStatus, string> = {
  concluida: 'Concluída',
  disponivel: 'Disponível',
  'bloqueada-requisito': 'Bloqueada',
  'bloqueada-setor': 'Setor bloqueado',
};

interface Props {
  mission: MissionDefinition;
  status: MissionStatus;
  state: GameState;
  catalog: Catalog;
  showSector?: boolean;
}

export function MissionRow({ mission, status, state, catalog, showSector = false }: Props) {
  const record = state.progress.missions[mission.id];
  const done = status === 'concluida';
  const locked = status === 'bloqueada-requisito' || status === 'bloqueada-setor';
  const missing = status === 'bloqueada-requisito' ? missingPrerequisites(mission, state, catalog) : [];
  return (
    <a
      href={href(`/missao/${mission.id}`)}
      className={`mission-row ${done ? 'is-done' : ''} ${locked ? 'is-locked' : ''}`}
      style={sectorStyle(mission.sector)}
      aria-label={`${mission.title} — ${STATUS_LABEL[status]}`}
    >
      <span className="status-icon" aria-hidden="true">
        <Icon name={done ? 'check' : locked ? 'lock' : 'play'} size={18} />
      </span>
      <span>
        <h3>{mission.title}</h3>
        <span className="summary">{mission.summary}</span>
        {missing.length > 0 && (
          <span className="requires" style={{ display: 'block' }}>
            <Icon name="lock" size={12} /> Requer: {missing.map((m) => m.title).join(', ')}
          </span>
        )}
        {status === 'bloqueada-setor' && (
          <span className="requires" style={{ display: 'block' }}>
            <Icon name="lock" size={12} /> {getSector(mission.sector).unlockHint}
          </span>
        )}
      </span>
      <span className="side">
        <span className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
          {showSector && <span className="faint">{getSector(mission.sector).name}</span>}
          <CategoryChip category={mission.category} />
        </span>
        <DifficultyPips value={mission.difficulty} />
        <span>
          <Icon name="clock" size={14} /> {mission.estimatedMinutes} min · {mission.steps.length} etapas
        </span>
        {done ? (
          <span>
            Recorde {pct(record?.bestAccuracy ?? 0)} · <span className="xp-tag">revisão até {Math.round(missionBaseXp(mission) * 0.2)} XP</span>
          </span>
        ) : (
          <span className="xp-tag">até {maxFirstCompletionXp(mission)} XP</span>
        )}
      </span>
    </a>
  );
}
