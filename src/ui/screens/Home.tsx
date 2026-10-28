import { CONCEPTS } from '../../content/concepts';
import { getSector } from '../../content/sectors';
import { ACHIEVEMENTS } from '../../domain/achievements';
import { maxFirstCompletionXp } from '../../domain/xp';
import { href } from '../../app/router';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { CategoryChip, DifficultyPips, Logo, SectorChip, XpBar } from '../components/common';
import { RichText } from '../components/RichText';
import { useDerived } from '../lib/derived';
import { HISTORY_ICON, relativeTime, sectorStyle } from '../lib/format';
import './screens.css';

function Welcome() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-intro enter">
          <Logo size="lg" />
          <h1>
            Domine o computador, <em>uma missão por vez.</em>
          </h1>
          <p className="lead">
            Um jogo para aprender informática praticando: atalhos de verdade, arquivos e terminal simulados, golpes para
            desmascarar e problemas para diagnosticar. Sem cadastro: tudo fica no seu navegador.
          </p>
          <div className="row" style={{ marginTop: 'var(--space-5)' }}>
            <a className="btn primary large" href={href('/inicio')}>
              <Icon name="play" /> Começar jornada
            </a>
            <a className="btn ghost" href={href('/config')}>
              <Icon name="upload" /> Tenho um backup
            </a>
          </div>
          <div className="feature-list">
            <div className="feature">
              <Icon name="target" />
              <span>
                <strong>Aprender fazendo</strong>Simulações com estado próprio, não só perguntas.
              </span>
            </div>
            <div className="feature">
              <Icon name="compass" />
              <span>
                <strong>No seu ritmo</strong>O jogo se ajusta ao que você já sabe e ao que precisa reforçar.
              </span>
            </div>
            <div className="feature">
              <Icon name="shield" />
              <span>
                <strong>Seguro</strong>Nada aqui mexe no seu computador de verdade.
              </span>
            </div>
          </div>
        </div>
        <div className="panel hud enter" aria-hidden="true">
          <div className="boot-log">
            <div>nexo://sistema iniciando…</div>
            <div>
              carregando setor <b>fundamentos</b> ........ <span className="ok">ok</span>
            </div>
            <div>
              carregando setor <b>domínio do sistema</b> ... <span className="ok">ok</span>
            </div>
            <div>
              carregando setor <b>internet e segurança</b> . <span className="ok">ok</span>
            </div>
            <div>
              carregando setor <b>diagnóstico</b> .......... <span className="ok">ok</span>
            </div>
            <div>
              carregando setor <b>eficiência</b> ........... <span className="ok">ok</span>
            </div>
            <div>38 missões · 10 formatos de desafio · 66 conceitos</div>
            <div>
              aguardando agente <span className="cursor" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function Home() {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  if (!state.profile.onboardingCompleted) return <Welcome />;

  const [top, ...others] = d.recommendations;
  const toNext = d.level.xpForNext - d.level.xpIntoLevel;
  const achievementsDone = Object.keys(state.progress.achievements).length;
  const recent = [...state.history].reverse().slice(0, 5);

  return (
    <div className="page">
      <section className="hero">
        <div className="panel hud player-card enter">
          <div className="rank">
            <div className="level-badge" aria-label={`Nível ${d.level.level}`}>
              <strong>{d.level.level}</strong>
              <small>NÍVEL</small>
            </div>
            <div>
              <div className="eyebrow accent">{d.title}</div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 2vw + 1rem, 2rem)' }}>Olá, {state.profile.nickname}</h1>
              <p className="muted">
                {d.completed.size === 0 ? 'Sua jornada começa agora.' : `${d.completed.size} de ${store.catalog.missions.length} missões concluídas.`}
              </p>
            </div>
          </div>
          <div>
            <XpBar value={d.level.progress} label={`Progresso para o nível ${d.level.level + 1}`} />
            <div className="xp-caption">
              <span>
                {d.level.xpIntoLevel} / {d.level.xpForNext} XP
              </span>
              <span>
                faltam {toNext} XP para o nível {d.level.level + 1}
              </span>
            </div>
          </div>
          <div className="row">
            <span className="chip">
              <Icon name="flame" size={14} /> {d.streak.current} {d.streak.current === 1 ? 'dia seguido' : 'dias seguidos'}
            </span>
            <span className="chip">
              <Icon name="trophy" size={14} /> {achievementsDone}/{ACHIEVEMENTS.length} conquistas
            </span>
            <span className="chip">
              <Icon name="star" size={14} /> {state.progress.xp} XP no total
            </span>
          </div>
        </div>

        {top ? (
          <article className="panel rec-card enter" style={sectorStyle(top.mission.sector)} aria-labelledby="rec-title">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="eyebrow accent">
                {top.type === 'nova' ? 'Missão recomendada' : top.type === 'revisao' ? 'Revisão recomendada' : 'Reforço recomendado'}
              </span>
              <SectorChip sector={top.mission.sector} />
            </div>
            <h2 id="rec-title">{top.mission.title}</h2>
            <p className="muted">{top.mission.summary}</p>
            <div className="meta-row">
              <CategoryChip category={top.mission.category} />
              <DifficultyPips value={top.mission.difficulty} />
              <span>
                <Icon name="clock" size={16} /> {top.mission.estimatedMinutes} min
              </span>
              {top.type === 'nova' && (
                <span className="mono" style={{ color: 'var(--accent)' }}>
                  até {maxFirstCompletionXp(top.mission)} XP
                </span>
              )}
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                Por que esta missão?
              </div>
              <ul className="reasons">
                {top.reasons.map((r) => (
                  <li key={r}>
                    <Icon name="chevron-right" size={16} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="row" style={{ marginTop: 'auto' }}>
              <a className="btn primary large" href={href(`/missao/${top.mission.id}/jogar`)}>
                <Icon name="play" /> {d.completed.size === 0 ? 'Iniciar' : 'Continuar'}
              </a>
              <a className="btn ghost" href={href(`/missao/${top.mission.id}`)}>
                Ver detalhes
              </a>
            </div>
          </article>
        ) : (
          <article className="panel rec-card enter">
            <span className="eyebrow accent">Tudo em dia</span>
            <h2>Nenhuma missão pendente agora</h2>
            <p className="muted">
              Você concluiu tudo o que está aberto e não há revisões vencidas. Pratique no Treino ou volte amanhã para revisar.
            </p>
            <div className="row">
              <a className="btn primary" href={href('/treino')}>
                <Icon name="dumbbell" /> Ir para o treino
              </a>
              <a className="btn ghost" href={href('/campanha')}>
                Ver campanha
              </a>
            </div>
          </article>
        )}
      </section>

      {d.codexHints.length > 0 && (
        <div className="callout info" style={{ marginBottom: 'var(--space-5)' }}>
          <Icon name="book" />
          <div>
            <div className="callout-title">Antes da próxima tentativa</div>
            {d.codexHints.map((h) => (
              <div key={h.concept}>
                {h.reason}{' '}
                <a href={href(`/codex/${h.concept}`)}>Ler sobre {CONCEPTS[h.concept]}</a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="stack">
          {others.length > 0 && (
            <section className="panel">
              <div className="panel-title">
                <h2>Outras sugestões</h2>
                <a href={href('/missoes')} className="btn ghost small">
                  Central de missões <Icon name="arrow-right" size={16} />
                </a>
              </div>
              <div className="mission-list">
                {others.map((r) => (
                  <a key={r.mission.id} href={href(`/missao/${r.mission.id}`)} className="mission-row" style={sectorStyle(r.mission.sector)}>
                    <span className="status-icon">
                      <Icon name={r.type === 'nova' ? 'play' : 'repeat'} size={18} />
                    </span>
                    <span>
                      <h3>{r.mission.title}</h3>
                      <span className="summary">{r.reasons[0]}</span>
                    </span>
                    <span className="side">
                      <DifficultyPips value={r.mission.difficulty} showLabel={false} />
                      <span>{getSector(r.mission.sector).name}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
          <section aria-label="Acesso rápido" className="quick-grid">
            <a className="quick-link" href={href('/campanha')}>
              <span className="ql-icon">
                <Icon name="map" />
              </span>
              <span>
                <strong>Campanha</strong>
                <span className="muted">
                  {d.sectors.size} de {store.catalog.sectors.length} setores abertos
                </span>
              </span>
            </a>
            <a className="quick-link" href={href('/treino')}>
              <span className="ql-icon">
                <Icon name="dumbbell" />
              </span>
              <span>
                <strong>Treino</strong>
                <span className="muted">Digitação, atalhos e revisões</span>
              </span>
            </a>
            <a className="quick-link" href={href('/conquistas')}>
              <span className="ql-icon">
                <Icon name="trophy" />
              </span>
              <span>
                <strong>Conquistas</strong>
                <span className="muted">
                  {achievementsDone} de {ACHIEVEMENTS.length}
                </span>
              </span>
            </a>
            <a className="quick-link" href={href('/estatisticas')}>
              <span className="ql-icon">
                <Icon name="chart" />
              </span>
              <span>
                <strong>Estatísticas</strong>
                <span className="muted">Precisão e evolução</span>
              </span>
            </a>
          </section>
        </div>

        <section className="panel">
          <div className="panel-title">
            <h2>Atividade recente</h2>
            <a href={href('/perfil')} className="btn ghost small">
              Perfil <Icon name="arrow-right" size={16} />
            </a>
          </div>
          {recent.length === 0 ? (
            <p className="muted">Nenhuma atividade ainda. Conclua sua primeira missão para começar o registro.</p>
          ) : (
            <ul className="history-list">
              {recent.map((h) => (
                <li key={h.id}>
                  <Icon name={HISTORY_ICON[h.type]} size={18} />
                  <span>
                    <RichText as="inline" text={h.text} />
                    <time dateTime={new Date(h.at).toISOString()}>{relativeTime(h.at, d.now)}</time>
                  </span>
                  <span className="xp">{h.xp ? `+${h.xp} XP` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
