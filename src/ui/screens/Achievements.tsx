import { ACHIEVEMENTS, buildAchievementContext } from '../../domain/achievements';
import { useGame, useStore } from '../../state/GameContext';
import { Icon, type IconName } from '../components/Icon';
import { Meter } from '../components/common';
import { useDerived } from '../lib/derived';
import { formatDate } from '../lib/format';
import './screens.css';

export function Achievements() {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  const ctx = buildAchievementContext(state, store.catalog, d.now);
  const unlocked = state.progress.achievements;
  const count = Object.keys(unlocked).length;
  const sorted = [...ACHIEVEMENTS].sort((a, b) => Number(b.id in unlocked) - Number(a.id in unlocked));
  const milestones = Object.entries(unlocked)
    .sort(([, a], [, b]) => a - b)
    .map(([id, at]) => ({ def: ACHIEVEMENTS.find((a) => a.id === id), at }))
    .filter((m) => m.def);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Emblemas e títulos</span>
          <h1>Conquistas</h1>
          <p className="lead">
            {count} de {ACHIEVEMENTS.length} desbloqueadas. Cada conquista é concedida pelas regras do jogo uma única vez; algumas liberam títulos que
            você pode exibir no perfil.
          </p>
        </div>
        <div style={{ minWidth: 220 }}>
          <Meter value={count / ACHIEVEMENTS.length} label="Conquistas desbloqueadas" />
        </div>
      </header>

      <div className="badge-grid">
        {sorted.map((a) => {
          const at = unlocked[a.id];
          const done = at !== undefined;
          const progress = a.progress?.(ctx);
          return (
            <article key={a.id} className={`badge ${done ? 'unlocked' : ''}`}>
              <span className="badge-icon" aria-hidden="true">
                <Icon name={(done ? a.icon : 'lock') as IconName} size={22} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3>{a.name}</h3>
                <p>{a.description}</p>
                {a.title && (
                  <p style={{ fontSize: '0.8rem' }}>
                    Título: <strong>{a.title}</strong>
                  </p>
                )}
                {done ? (
                  <div className="badge-state">
                    <Icon name="check" size={12} /> Desbloqueada em {formatDate(at)}
                  </div>
                ) : progress ? (
                  <div style={{ marginTop: 6 }}>
                    <Meter value={progress.target ? progress.current / progress.target : 0} label={`Progresso em ${a.name}`} />
                    <div className="badge-state">
                      {progress.current}/{progress.target}
                    </div>
                  </div>
                ) : (
                  <div className="badge-state">Bloqueada</div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {milestones.length > 0 && (
        <section className="panel" style={{ marginTop: 'var(--space-5)' }}>
          <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Linha do tempo</h2>
          <ol className="history-list">
            {milestones.map(({ def, at }) => (
              <li key={def!.id}>
                <Icon name="trophy" size={18} />
                <span>
                  {def!.name}
                  <time dateTime={new Date(at).toISOString()}>{formatDate(at)}</time>
                </span>
                <span />
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
