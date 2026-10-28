import { useState } from 'react';
import { CATEGORIES } from '../../content/categories';
import { CONCEPT_IDS } from '../../content/concepts';
import { ACHIEVEMENTS, unlockedTitles } from '../../domain/achievements';
import { masterySummary } from '../../domain/mastery';
import { buildStats } from '../../domain/stats';
import { RANKS } from '../../domain/xp';
import { href } from '../../app/router';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { StatTile, XpBar } from '../components/common';
import { RichText } from '../components/RichText';
import { useDerived } from '../lib/derived';
import { HISTORY_ICON, STARTING_LEVELS, formatDateTime, pct } from '../lib/format';
import './screens.css';

const PAGE = 15;

export function Profile() {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  const [nickname, setNickname] = useState(state.profile.nickname);
  const [historyCount, setHistoryCount] = useState(PAGE);
  const stats = buildStats(state, store.catalog, d.now);
  const mastery = masterySummary(state, CONCEPT_IDS, d.now);
  const titles = [...new Set([d.rank, ...unlockedTitles(state)])];
  const nextRank = RANKS.find((r) => r.minLevel > d.level.level);
  const history = [...state.history].reverse();
  const declared = STARTING_LEVELS.find((l) => l.id === state.profile.startingLevel);
  const studied = stats.categories.filter((c) => c.steps > 0);

  const saveNickname = () => {
    const clean = nickname.trim().slice(0, 24) || 'Agente';
    setNickname(clean);
    if (clean !== state.profile.nickname) void store.setProfile({ nickname: clean });
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Perfil local</span>
          <h1>{state.profile.nickname}</h1>
          <p className="lead">Seu progresso fica salvo apenas neste navegador. Não há conta nem dados pessoais.</p>
        </div>
      </header>

      <div className="grid-2">
        <div className="stack">
          <section className="panel hud stack">
            <div className="rank" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <div className="level-badge" aria-label={`Nível ${d.level.level}`}>
                <strong>{d.level.level}</strong>
                <small>NÍVEL</small>
              </div>
              <div>
                <div className="eyebrow accent">{d.title}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{state.progress.xp} XP acumulados</div>
                {nextRank && (
                  <p className="faint" style={{ fontSize: '0.85rem' }}>
                    Próxima patente: {nextRank.title} no nível {nextRank.minLevel}
                  </p>
                )}
              </div>
            </div>
            <div>
              <XpBar value={d.level.progress} label={`Progresso para o nível ${d.level.level + 1}`} />
              <div className="xp-caption">
                <span>
                  {d.level.xpIntoLevel}/{d.level.xpForNext} XP neste nível
                </span>
                <span>
                  faltam {d.level.xpForNext - d.level.xpIntoLevel} XP para o nível {d.level.level + 1}
                </span>
              </div>
            </div>
            <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="field">
                <label htmlFor="nick">Apelido (opcional)</label>
                <input
                  id="nick"
                  className="input"
                  maxLength={24}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onBlur={saveNickname}
                  onKeyDown={(e) => e.key === 'Enter' && saveNickname()}
                />
                <span className="help">Aparece só para você, neste dispositivo.</span>
              </div>
              <div className="field">
                <label htmlFor="title-select">Título exibido</label>
                <select
                  id="title-select"
                  className="select"
                  value={state.profile.selectedTitle ?? d.rank}
                  onChange={(e) => void store.setProfile({ selectedTitle: e.target.value === d.rank ? null : e.target.value })}
                >
                  {titles.map((t) => (
                    <option key={t} value={t}>
                      {t}
                      {t === d.rank ? ' (patente)' : ''}
                    </option>
                  ))}
                </select>
                <span className="help">Conquistas desbloqueiam novos títulos.</span>
              </div>
            </div>
          </section>

          <div className="stat-grid">
            <StatTile icon="check" label="Missões concluídas" value={`${stats.uniqueCompleted}/${stats.totalMissions}`} />
            <StatTile icon="trophy" label="Conquistas" value={`${Object.keys(state.progress.achievements).length}/${ACHIEVEMENTS.length}`} />
            <StatTile icon="crosshair" label="Precisão" value={pct(stats.overallAccuracy)} hint={stats.overallAccuracy === null ? 'dados insuficientes' : undefined} />
            <StatTile icon="flame" label="Dias seguidos" value={stats.streak.current} hint={`maior sequência: ${stats.streak.longest}`} />
            <StatTile icon="brain" label="Conceitos dominados" value={mastery.dominado} hint={`${mastery.praticado} praticados · ${mastery.aprendendo} em aprendizado`} />
            <StatTile icon="layers" label="Áreas estudadas" value={`${studied.length}/${CATEGORIES.length}`} />
          </div>

          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <section className="panel">
              <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Pontos fortes</h2>
              {stats.strengths.length === 0 ? (
                <p className="muted" style={{ fontSize: '0.9rem' }}>
                  Ainda sem dados suficientes. Áreas com 85% ou mais de precisão aparecem aqui.
                </p>
              ) : (
                <ul className="objectives">
                  {stats.strengths.slice(0, 4).map((c) => (
                    <li key={c.id}>
                      <Icon name="star" size={16} /> {c.name} · {pct(c.accuracy)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="panel">
              <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Para praticar</h2>
              {stats.weaknesses.length === 0 && stats.needsReview.length === 0 ? (
                <p className="muted" style={{ fontSize: '0.9rem' }}>
                  Nenhuma área com dificuldade registrada.
                </p>
              ) : (
                <ul className="objectives">
                  {stats.weaknesses.slice(0, 4).map((c) => (
                    <li key={c.id}>
                      <Icon name="alert" size={16} /> {c.name} · {pct(c.accuracy)}
                    </li>
                  ))}
                  {stats.needsReview.length > 0 && (
                    <li>
                      <Icon name="repeat" size={16} /> {stats.needsReview.length} conceito(s) para revisar —{' '}
                      <a href={href('/treino/inteligente')}>revisão inteligente</a>
                    </li>
                  )}
                </ul>
              )}
            </section>
          </div>

          <section className="panel">
            <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Configuração inicial</h2>
            <p className="muted" style={{ fontSize: '0.92rem' }}>
              Nível declarado: <strong>{declared?.label ?? '—'}</strong>
              {state.profile.assessment && !state.profile.assessment.skipped && <> · avaliação: {pct(state.profile.assessment.score)}</>}
              {state.profile.assessment?.skipped && ' · avaliação pulada'}
            </p>
            <p className="muted" style={{ fontSize: '0.92rem' }}>
              Áreas marcadas:{' '}
              {state.profile.wantsEverything
                ? 'todas (quero aprender tudo)'
                : state.profile.focusAreas.map((a) => CATEGORIES.find((c) => c.id === a)?.short).join(', ') || '—'}
            </p>
            <a className="btn small" href={href('/config')} style={{ marginTop: 'var(--space-3)' }}>
              <Icon name="refresh" size={16} /> Refazer nas configurações
            </a>
          </section>
        </div>

        <section className="panel">
          <div className="panel-title">
            <h2>Histórico</h2>
            <span className="faint" style={{ fontSize: '0.8rem' }}>
              {state.history.length} registro(s)
            </span>
          </div>
          {history.length === 0 ? (
            <p className="muted">Nenhuma atividade registrada ainda.</p>
          ) : (
            <>
              <ul className="history-list">
                {history.slice(0, historyCount).map((h) => (
                  <li key={h.id}>
                    <Icon name={HISTORY_ICON[h.type]} size={18} />
                    <span>
                      <RichText as="inline" text={h.text} />
                      <time dateTime={new Date(h.at).toISOString()}>{formatDateTime(h.at)}</time>
                    </span>
                    <span className="xp">{h.xp ? `+${h.xp} XP` : ''}</span>
                  </li>
                ))}
              </ul>
              {historyCount < history.length && (
                <button type="button" className="btn ghost small" onClick={() => setHistoryCount((n) => n + PAGE)} style={{ marginTop: 'var(--space-3)' }}>
                  Mostrar mais
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
