import type { SectorId } from '../../content/types';
import { missionsInSector } from '../../content/missions';
import { missionStatus, sectorProgress } from '../../domain/unlock';
import { href } from '../../app/router';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { Meter } from '../components/common';
import { MissionRow } from '../components/MissionRow';
import { useDerived } from '../lib/derived';
import { SECTOR_ICON, sectorStyle } from '../lib/format';
import './screens.css';
import './Campaign.css';

export function Campaign({ sector }: { sector?: string | undefined }) {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  const sectors = store.catalog.sectors;
  const fallback =
    sectors.find((s) => d.sectors.has(s.id) && sectorProgress(s.id, state, store.catalog).done < sectorProgress(s.id, state, store.catalog).total) ??
    sectors[0]!;
  const selected = sectors.find((s) => s.id === sector) ?? fallback;
  const missions = missionsInSector(selected.id as SectorId);
  const selectedOpen = d.sectors.has(selected.id);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Mapa do sistema</span>
          <h1>Campanha</h1>
          <p className="lead">
            Cinco setores, do primeiro contato à automação. Setores abrem por progresso; dentro de cada um, as missões se ramificam para você escolher o
            caminho.
          </p>
        </div>
      </header>

      <div className="campaign">
        <ol className="sector-map" aria-label="Setores">
          {sectors.map((s, i) => {
            const open = d.sectors.has(s.id);
            const progress = sectorProgress(s.id, state, store.catalog);
            const complete = progress.total > 0 && progress.done >= progress.total;
            const isSelected = s.id === selected.id;
            return (
              <li key={s.id} className={`sector-node ${open ? 'open' : 'locked'} ${complete ? 'complete' : ''}`} style={sectorStyle(s.id)}>
                <a href={href(`/campanha/${s.id}`)} className="sector-card" aria-current={isSelected ? 'true' : undefined}>
                  <span className="sector-emblem" aria-hidden="true">
                    <Icon name={open ? SECTOR_ICON[s.id] : 'lock'} size={26} />
                  </span>
                  <span className="sector-info">
                    <span className="eyebrow">Setor {String(i + 1).padStart(2, '0')}</span>
                    <strong>{s.name}</strong>
                    <span className="tagline">{s.tagline}</span>
                    {open ? (
                      <>
                        <Meter value={progress.total ? progress.done / progress.total : 0} label={`Progresso em ${s.name}`} color="var(--sector-color)" />
                        <span className="progress-text">
                          {complete ? (
                            <>
                              <Icon name="check" size={14} /> Setor concluído
                            </>
                          ) : (
                            `${progress.done} de ${progress.total} missões`
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="lock-hint">
                        <Icon name="lock" size={14} /> {s.unlockHint}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        <section className="panel sector-detail" style={sectorStyle(selected.id)} aria-labelledby="sector-title">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow" style={{ color: 'var(--sector-color)' }}>
              Setor {String(selected.order).padStart(2, '0')}
            </span>
            <span className={`chip ${selectedOpen ? 'accent' : ''}`}>
              <Icon name={selectedOpen ? 'unlock' : 'lock'} size={14} /> {selectedOpen ? 'Aberto' : 'Bloqueado'}
            </span>
          </div>
          <h2 id="sector-title">{selected.name}</h2>
          <p className="muted">{selected.description}</p>
          <ul className="objectives">
            {selected.objectives.map((o) => (
              <li key={o}>
                <Icon name="target" size={16} /> {o}
              </li>
            ))}
          </ul>
          {!selectedOpen && (
            <div className="callout warn">
              <Icon name="lock" />
              <div>
                <div className="callout-title">Como abrir</div>
                {selected.unlockHint}
              </div>
            </div>
          )}
          <div className="mission-list">
            {missions.map((m) => (
              <MissionRow key={m.id} mission={m} status={missionStatus(m, state, store.catalog, d.sectors)} state={state} catalog={store.catalog} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
