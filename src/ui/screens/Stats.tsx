import { CONCEPTS } from '../../content/concepts';
import { MASTERY_LABEL, type MasteryState } from '../../domain/mastery';
import { buildStats, MIN_STEPS_FOR_ACCURACY } from '../../domain/stats';
import { href } from '../../app/router';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { EmptyState, StatTile } from '../components/common';
import { useDerived } from '../lib/derived';
import { formatDuration, pct } from '../lib/format';
import './screens.css';

const MASTERY_ORDER: MasteryState[] = ['dominado', 'praticado', 'aprendendo', 'nao-estudado'];
const MASTERY_COLOR: Record<MasteryState, string> = {
  dominado: 'var(--accent)',
  praticado: 'var(--signal)',
  aprendendo: 'var(--warn)',
  'nao-estudado': 'var(--surface-3)',
};

/** Linha de tendência (precisão 0..1 das últimas tentativas). Um ponto por tentativa. */
function Sparkline({ values, label }: { values: number[]; label: string }) {
  if (values.length < 2) return <span className="faint" style={{ fontSize: '0.75rem' }}>poucos dados</span>;
  const w = 96;
  const h = 28;
  const step = w / (values.length - 1);
  const y = (v: number) => 3 + (1 - v) * (h - 6);
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1]!;
  return (
    <svg className="sparkline" width={w + 8} height={h} viewBox={`-4 0 ${w + 8} ${h}`} role="img" aria-label={`${label}: ${values.map((v) => pct(v)).join(', ')}`}>
      <line x1="0" x2={w} y1={y(0.6)} y2={y(0.6)} stroke="var(--line-strong)" strokeDasharray="2 3" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={i * step} cy={y(v)} r={i === values.length - 1 ? 3.5 : 6} fill={i === values.length - 1 ? 'var(--accent)' : 'transparent'}>
          <title>{`Tentativa ${i + 1}: ${pct(v)}`}</title>
        </circle>
      ))}
      <title>{`Última: ${pct(last)}`}</title>
    </svg>
  );
}

export function Stats() {
  const { state } = useGame();
  const store = useStore();
  const d = useDerived();
  const report = buildStats(state, store.catalog, d.now);
  const totalConcepts = MASTERY_ORDER.reduce((n, s) => n + report.mastery[s].length, 0);
  const hasActivity = report.missionsStarted > 0 || state.progress.stats.trainingSessions > 0;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow accent">Registros do agente</span>
          <h1>Estatísticas</h1>
          <p className="lead">
            Tudo aqui vem das suas tentativas reais. A precisão de uma área só aparece depois de {MIN_STEPS_FOR_ACCURACY} etapas respondidas; antes
            disso não há dados suficientes para uma conclusão justa.
          </p>
        </div>
      </header>

      {!hasActivity ? (
        <EmptyState icon="chart" title="Ainda não há estatísticas">
          Conclua uma missão ou uma sessão de treino para começar a ver sua evolução. <a href={href('/missoes')}>Ir para as missões</a>
        </EmptyState>
      ) : (
        <div className="stack" style={{ gap: 'var(--space-5)' }}>
          <div className="stat-grid">
            <StatTile icon="play" label="Missões iniciadas" value={report.missionsStarted} />
            <StatTile icon="check" label="Missões concluídas" value={`${report.uniqueCompleted}/${report.totalMissions}`} hint={`${report.runsCompleted} conclusões no total`} />
            <StatTile icon="target" label="Taxa de conclusão" value={pct(report.completionRate)} hint="concluídas ÷ iniciadas" />
            <StatTile icon="crosshair" label="Precisão geral" value={pct(report.overallAccuracy)} hint={report.overallAccuracy === null ? 'dados insuficientes' : 'média por etapa'} />
            <StatTile icon="repeat" label="Tentativas registradas" value={report.totalAttempts} hint={`${report.runsFailed} sem aprovação`} />
            <StatTile icon="clock" label="Tempo de prática" value={formatDuration(report.totalTimeMs)} hint={report.averageRunMs ? `média ${formatDuration(report.averageRunMs)}` : undefined} />
            <StatTile icon="flame" label="Sequência" value={`${report.streak.current} d`} hint={`maior: ${report.streak.longest} d`} />
            <StatTile icon="keyboard" label="Melhor digitação" value={report.bestTypingWpm ? `${report.bestTypingWpm} ppm` : '—'} hint="com precisão ≥ 92%" />
          </div>

          <section className="panel">
            <div className="panel-title">
              <h2>Precisão por área</h2>
              <span className="faint" style={{ fontSize: '0.8rem' }}>
                tendência: últimas tentativas · linha tracejada = 60%
              </span>
            </div>
            <div className="bar-list">
              {report.categories.map((c) => (
                <div key={c.id} className="bar-row" style={{ gridTemplateColumns: undefined }}>
                  <span>
                    {c.name}
                    <span className="faint" style={{ display: 'block', fontSize: '0.72rem' }}>
                      {c.missionsDone}/{c.missionsTotal} missões · {c.steps} etapas
                    </span>
                  </span>
                  <span className="bar">
                    {c.accuracy === null ? (
                      <span className="insufficient">{c.steps === 0 ? 'Não estudado' : 'Dados insuficientes'}</span>
                    ) : (
                      <span className="row" style={{ gap: 'var(--space-3)', flexWrap: 'nowrap' }}>
                        <span className="meter" style={{ flex: 1 }} title={`${c.name}: ${pct(c.accuracy)} de precisão`}>
                          <span style={{ '--value': `${c.accuracy * 100}%` } as React.CSSProperties} />
                        </span>
                        <Sparkline values={c.trend} label={`Tendência em ${c.name}`} />
                      </span>
                    )}
                  </span>
                  <span className="value">{pct(c.accuracy)}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid-2">
            <section className="panel">
              <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Pontos fortes</h2>
              {report.strengths.length === 0 ? (
                <p className="muted">Nenhuma área com precisão de 85% ou mais (e dados suficientes) ainda.</p>
              ) : (
                <ul className="objectives">
                  {report.strengths.map((c) => (
                    <li key={c.id}>
                      <Icon name="star" size={16} /> {c.name} — {pct(c.accuracy)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="panel">
              <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Precisam de prática</h2>
              {report.weaknesses.length === 0 && report.needsReview.length === 0 ? (
                <p className="muted">Nada pendente agora.</p>
              ) : (
                <ul className="objectives">
                  {report.weaknesses.map((c) => (
                    <li key={c.id}>
                      <Icon name="alert" size={16} /> {c.name} — {pct(c.accuracy)}
                    </li>
                  ))}
                  {report.needsReview.slice(0, 6).map((id) => (
                    <li key={id}>
                      <Icon name="repeat" size={16} /> <a href={href(`/codex/${id}`)}>{CONCEPTS[id]}</a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="panel">
            <div className="panel-title">
              <h2>Domínio dos conceitos</h2>
              <span className="faint" style={{ fontSize: '0.8rem' }}>
                {totalConcepts} conceitos
              </span>
            </div>
            <div className="mastery-bar" role="img" aria-label={MASTERY_ORDER.map((s) => `${MASTERY_LABEL[s]}: ${report.mastery[s].length}`).join(', ')}>
              {MASTERY_ORDER.map((s) =>
                report.mastery[s].length > 0 ? (
                  <span
                    key={s}
                    style={{ flexGrow: report.mastery[s].length, background: MASTERY_COLOR[s] }}
                    title={`${MASTERY_LABEL[s]}: ${report.mastery[s].length}`}
                  />
                ) : null,
              )}
            </div>
            <p className="faint" style={{ fontSize: '0.82rem', margin: 'var(--space-3) 0' }}>
              Dominado = pelo menos 3 acertos (2 de primeira), com uma revisão em outro momento e acertos recentes. Uma única resposta certa nunca basta.
            </p>
            <div className="mastery-grid">
              {MASTERY_ORDER.map((s) => (
                <div key={s} className="mastery-col">
                  <h3>
                    <span className={`mastery-dot ${s}`} style={{ fontSize: '0.9rem', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                      {MASTERY_LABEL[s]}
                    </span>
                    <span className="mono">{report.mastery[s].length}</span>
                  </h3>
                  {s === 'nao-estudado' ? (
                    <p className="faint" style={{ fontSize: '0.82rem' }}>
                      Conceitos que você ainda não praticou.
                    </p>
                  ) : report.mastery[s].length === 0 ? (
                    <p className="faint" style={{ fontSize: '0.82rem' }}>
                      Nenhum ainda.
                    </p>
                  ) : (
                    <ul>
                      {report.mastery[s].map((id) => (
                        <li key={id}>
                          <a href={href(`/codex/${id}`)}>{CONCEPTS[id]}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
