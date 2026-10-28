import { getMission } from '../../content/missions';
import { CONCEPTS } from '../../content/concepts';
import { getSector } from '../../content/sectors';
import { conceptMastery, MASTERY_LABEL } from '../../domain/mastery';
import { missingPrerequisites, missionStatus } from '../../domain/unlock';
import { maxFirstCompletionXp, missionBaseXp, REVIEW_INTERVAL_HOURS } from '../../domain/xp';
import { PASS_THRESHOLD } from '../../domain/engine';
import { href } from '../../app/router';
import { useGame, useStore } from '../../state/GameContext';
import { KIND_LABEL } from '../challenges/registry';
import { Icon } from '../components/Icon';
import { CategoryChip, DifficultyPips, EmptyState, SectorChip } from '../components/common';
import { RichText } from '../components/RichText';
import { useDerived } from '../lib/derived';
import { formatDateTime, pct, sectorStyle } from '../lib/format';
import './screens.css';

export function MissionBriefing({ id }: { id: string }) {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  const mission = getMission(id);
  if (!mission) {
    return (
      <div className="page">
        <EmptyState icon="compass" title="Missão não encontrada">
          <a href={href('/missoes')}>Voltar à central de missões</a>
        </EmptyState>
      </div>
    );
  }
  const status = missionStatus(mission, state, store.catalog, d.sectors);
  const record = state.progress.missions[mission.id];
  const missing = missingPrerequisites(mission, state, store.catalog);
  const playable = status === 'disponivel' || status === 'concluida';
  const kinds = [...new Set(mission.steps.map((s) => s.kind))];
  const base = missionBaseXp(mission);

  return (
    <div className="page" style={sectorStyle(mission.sector)}>
      <a href={href(`/campanha/${mission.sector}`)} className="btn ghost small" style={{ marginBottom: 'var(--space-4)' }}>
        <Icon name="arrow-left" size={16} /> {getSector(mission.sector).name}
      </a>
      <div className="grid-2">
        <div className="stack">
          <header className="briefing-head">
            <div className="row">
              <SectorChip sector={mission.sector} />
              <CategoryChip category={mission.category} />
              <span className="chip">{mission.subcategory}</span>
            </div>
            <h1>{mission.title}</h1>
            <p className="muted">{mission.summary}</p>
          </header>
          <div className="briefing-text">
            <span className="eyebrow" style={{ color: 'var(--sector-color)' }}>
              Briefing
            </span>
            <RichText text={mission.briefing} />
          </div>
          <section className="panel">
            <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Ao final você saberá</h2>
            <ul className="objectives">
              {mission.objectives.map((o) => (
                <li key={o}>
                  <Icon name="check" size={16} /> <RichText as="inline" text={o} />
                </li>
              ))}
            </ul>
          </section>
          {mission.platformNote && (
            <div className="callout info">
              <Icon name="info" />
              <div>
                <div className="callout-title">Varia conforme o sistema</div>
                <RichText text={mission.platformNote} />
              </div>
            </div>
          )}
        </div>

        <aside className="stack">
          <section className="panel hud stack" style={{ gap: 'var(--space-3)' }}>
            <div className="meta-row">
              <DifficultyPips value={mission.difficulty} />
              <span>
                <Icon name="clock" size={16} /> ~{mission.estimatedMinutes} min
              </span>
              <span>
                <Icon name="layers" size={16} /> {mission.steps.length} etapas
              </span>
            </div>
            <div className="step-kinds" aria-label="Formatos de desafio">
              {kinds.map((k) => (
                <span key={k} className="chip signal">
                  {KIND_LABEL[k]}
                </span>
              ))}
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Recompensa
              </div>
              {status === 'concluida' ? (
                <p className="muted" style={{ fontSize: '0.9rem' }}>
                  Revisão: até <strong className="mono">{Math.round(base * 0.2)} XP</strong> a cada {REVIEW_INTERVAL_HOURS} h, mais bônus se bater seu
                  recorde de {pct(record?.bestAccuracy ?? 0)}. Repetir antes disso conta para o domínio, mas não rende XP.
                </p>
              ) : (
                <p className="muted" style={{ fontSize: '0.9rem' }}>
                  Até <strong className="mono" style={{ color: 'var(--accent)' }}>{maxFirstCompletionXp(mission)} XP</strong> na primeira conclusão,
                  conforme a precisão. É preciso atingir {pct(PASS_THRESHOLD)} para concluir.
                </p>
              )}
            </div>
            {record && record.attempts > 0 && (
              <p className="faint" style={{ fontSize: '0.85rem' }}>
                {record.attempts} tentativa(s) · recorde {pct(record.bestAccuracy)}
                {record.lastCompletedAt ? ` · última conclusão ${formatDateTime(record.lastCompletedAt)}` : ''}
              </p>
            )}
            {status === 'bloqueada-setor' && (
              <div className="callout warn">
                <Icon name="lock" />
                <span>{getSector(mission.sector).unlockHint}</span>
              </div>
            )}
            {missing.length > 0 && (
              <div className="callout warn">
                <Icon name="lock" />
                <div>
                  <div className="callout-title">Antes, conclua:</div>
                  {missing.map((m) => (
                    <div key={m.id}>
                      <a href={href(`/missao/${m.id}`)}>{m.title}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {playable ? (
              <a className="btn primary large" href={href(`/missao/${mission.id}/jogar`)}>
                <Icon name={status === 'concluida' ? 'repeat' : 'play'} /> {status === 'concluida' ? 'Revisar missão' : 'Iniciar missão'}
              </a>
            ) : (
              <button type="button" className="btn large" disabled>
                <Icon name="lock" /> Bloqueada
              </button>
            )}
          </section>
          <section className="panel">
            <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Conceitos</h2>
            <ul className="codex-items">
              {mission.concepts.map((c) => {
                const m = conceptMastery(state, c, d.now);
                return (
                  <li key={c}>
                    <a href={href(`/codex/${c}`)}>
                      <span>{CONCEPTS[c]}</span>
                      <span className={`mastery-dot ${m.state}`}>{MASTERY_LABEL[m.state]}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
