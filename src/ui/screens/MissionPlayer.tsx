import { useEffect, useRef, useState } from 'react';
import type { MissionDefinition } from '../../content/types';
import { getMission } from '../../content/missions';
import { CONCEPTS } from '../../content/concepts';
import { getSector } from '../../content/sectors';
import { summarizeRun, PASS_THRESHOLD, type RunSummary } from '../../domain/engine';
import { conceptMastery, MASTERY_LABEL } from '../../domain/mastery';
import type { MissionReport } from '../../domain/progress';
import { isPlayable } from '../../domain/unlock';
import { levelFromXp, rankForLevel } from '../../domain/xp';
import { href, navigate } from '../../app/router';
import { audio } from '../../services/audio';
import { resolvePlatform } from '../../services/platform';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { Dialog, EmptyState, XpBar } from '../components/common';
import { RichText } from '../components/RichText';
import { StepPanel } from '../components/StepPanel';
import { useDerived } from '../lib/derived';
import { formatDuration, pct, sectorStyle } from '../lib/format';
import { useRun } from '../lib/useRun';
import './screens.css';
import './Player.css';

interface Outcome {
  summary: RunSummary;
  report: MissionReport;
  saved: boolean;
  xpBefore: number;
}

export function MissionPlayer({ id }: { id: string }) {
  const { state, ready } = useGame();
  const store = useStore();
  const mission = getMission(id);
  const [attempt, setAttempt] = useState(0);

  if (!mission) {
    return (
      <div className="page">
        <EmptyState icon="compass" title="Missão não encontrada">
          <a href={href('/missoes')}>Voltar à central de missões</a>
        </EmptyState>
      </div>
    );
  }
  if (ready && !isPlayable(mission, state, store.catalog)) {
    return (
      <div className="page">
        <EmptyState icon="lock" title="Esta missão ainda está bloqueada">
          <a href={href(`/missao/${mission.id}`)}>Ver o que falta para liberar</a>
        </EmptyState>
      </div>
    );
  }
  return <MissionRunView key={attempt} mission={mission} onRestart={() => setAttempt((n) => n + 1)} />;
}

function MissionRunView({ mission, onRestart }: { mission: MissionDefinition; onRestart: () => void }) {
  const store = useStore();
  const { state } = useGame();
  const { run, runRef, evaluation, showHint, submit, hint, reveal, next } = useRun(mission);
  const [confirmExit, setConfirmExit] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'saving' | 'results'>('playing');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const started = useRef(false);
  const platform = resolvePlatform(state.preferences.keyboardPlatform);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void store.startMission(mission);
  }, [store, mission]);

  const goNext = async () => {
    if (!next()) return;
    const summary = summarizeRun(runRef.current, mission, store.now());
    if (!summary) return;
    setPhase('saving');
    const xpBefore = store.state.progress.xp;
    const { report, saved } = await store.finishMission(mission, summary);
    setOutcome({ summary, report, saved, xpBefore });
    setPhase('results');
    if (report.levelAfter > report.levelBefore) audio.play('levelup');
    else audio.play(summary.passed ? 'complete' : 'wrong');
  };

  const hasProgress = run.steps.some((s) => s.attempts > 0);
  const exit = () => (hasProgress && phase === 'playing' ? setConfirmExit(true) : navigate(`/missao/${mission.id}`));

  if (phase === 'results' && outcome) return <Results mission={mission} outcome={outcome} onRestart={onRestart} />;

  const last = run.stepIndex + 1 >= mission.steps.length;

  return (
    <div className="player" style={sectorStyle(mission.sector)}>
      <header className="player-bar">
        <button type="button" className="btn ghost small" onClick={exit}>
          <Icon name="x" size={16} /> Sair
        </button>
        <div className="player-title">
          <span className="eyebrow" style={{ color: 'var(--sector-color)' }}>
            {getSector(mission.sector).name}
          </span>
          <strong>{mission.title}</strong>
        </div>
        <ol className="step-track" aria-label={`Etapa ${run.stepIndex + 1} de ${mission.steps.length}`}>
          {mission.steps.map((s, i) => {
            const p = run.steps[i]!;
            const cls = p.completed ? (p.revealed ? 'revealed' : 'done') : i === run.stepIndex ? 'current' : '';
            return (
              <li key={s.id} className={cls} aria-current={i === run.stepIndex ? 'step' : undefined}>
                <span className="visually-hidden">
                  Etapa {i + 1}: {s.title} {p.completed ? '(concluída)' : ''}
                </span>
              </li>
            );
          })}
        </ol>
      </header>

      <StepPanel
        mission={mission}
        run={run}
        evaluation={evaluation}
        showHint={showHint}
        platform={platform}
        preferVirtualKeyboard={state.preferences.preferVirtualKeyboard}
        submit={submit}
        onHint={hint}
        onReveal={reveal}
        onNext={() => void goNext()}
        busy={phase === 'saving'}
        nextLabel={
          !last ? (
            <>
              Continuar <Icon name="arrow-right" />
            </>
          ) : phase === 'saving' ? (
            'Salvando…'
          ) : (
            <>
              Ver resultado <Icon name="flag" />
            </>
          )
        }
      />

      {confirmExit && (
        <Dialog
          title="Sair da missão?"
          onClose={() => setConfirmExit(false)}
          actions={
            <>
              <button type="button" className="btn" onClick={() => setConfirmExit(false)}>
                Continuar jogando
              </button>
              <button type="button" className="btn danger" onClick={() => navigate(`/missao/${mission.id}`)}>
                Sair sem concluir
              </button>
            </>
          }
        >
          <p className="muted">Esta tentativa não será registrada e nenhum XP será concedido. Você pode recomeçar a missão quando quiser.</p>
        </Dialog>
      )}
    </div>
  );
}

function AccuracyRing({ value, passed }: { value: number; passed: boolean }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className={`ring ${passed ? 'passed' : 'failed'}`} role="img" aria-label={`Precisão ${pct(value)}`}>
      <circle cx="60" cy="60" r={r} className="ring-track" />
      <circle cx="60" cy="60" r={r} className="ring-value" strokeDasharray={c} strokeDashoffset={c * (1 - value)} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" className="ring-text">
        {Math.round(value * 100)}%
      </text>
      <text x="60" y="78" textAnchor="middle" className="ring-sub">
        precisão
      </text>
    </svg>
  );
}

function Results({ mission, outcome, onRestart }: { mission: MissionDefinition; outcome: Outcome; onRestart: () => void }) {
  const store = useStore();
  const { save, state } = useGame();
  const d = useDerived();
  const { summary, report, xpBefore } = outcome;
  const before = levelFromXp(xpBefore);
  const after = levelFromXp(xpBefore + report.xp.total);
  const leveledUp = report.levelAfter > report.levelBefore;
  const [barValue, setBarValue] = useState(leveledUp ? 0 : before.progress);
  useEffect(() => {
    const t = setTimeout(() => setBarValue(after.progress), 120);
    return () => clearTimeout(t);
  }, [after.progress]);
  const nextRec = d.recommendations.find((r) => r.mission.id !== mission.id);
  const saved = outcome.saved || save.status === 'saved';

  return (
    <div className="page results" style={sectorStyle(mission.sector)}>
      {leveledUp && (
        <div className="levelup-banner enter" role="status">
          <span className="burst" aria-hidden="true" />
          <Icon name="star" size={28} />
          <div>
            <div className="eyebrow">Subiu de nível</div>
            <strong>
              Nível {report.levelAfter} · {rankForLevel(report.levelAfter)}
            </strong>
          </div>
        </div>
      )}
      <section className="panel hud results-head enter">
        <AccuracyRing value={summary.accuracy} passed={summary.passed} />
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <span className="eyebrow accent">{summary.passed ? 'Missão concluída' : 'Missão não concluída'}</span>
          <h1>{summary.passed ? mission.title : 'Quase lá'}</h1>
          <p className="muted">
            {summary.passed
              ? summary.flawless
                ? 'Execução perfeita: sem erros e sem pistas.'
                : 'Bom trabalho. Os detalhes abaixo mostram onde ainda dá para melhorar.'
              : `É preciso pelo menos ${pct(PASS_THRESHOLD)} de precisão para concluir. Releia as explicações e tente de novo: os erros desta tentativa já contam para suas estatísticas.`}
          </p>
          <div className="meta-row">
            <span>
              <Icon name="target" size={16} /> {summary.firstTrySteps}/{summary.totalSteps} de primeira
            </span>
            <span>
              <Icon name="x" size={16} /> {summary.mistakes} erro(s)
            </span>
            <span>
              <Icon name="clock" size={16} /> {formatDuration(summary.durationMs)}
            </span>
            {summary.typing && (
              <span>
                <Icon name="keyboard" size={16} /> {summary.typing.wpm} ppm · {pct(summary.typing.accuracy)}
              </span>
            )}
            {summary.revealedSteps > 0 && (
              <span>
                <Icon name="eye" size={16} /> {summary.revealedSteps} solução(ões) vista(s)
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="grid-2" style={{ marginTop: 'var(--space-4)' }}>
        <div className="stack">
          <section className="panel">
            <div className="panel-title">
              <h2>Recompensa</h2>
              <strong className="mono xp-total">+{report.xp.total} XP</strong>
            </div>
            {report.xp.lines.length > 0 ? (
              <ul className="xp-lines">
                {report.xp.lines.map((l) => (
                  <li key={l.label}>
                    <span>{l.label}</span>
                    <span className="mono">+{l.xp}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">
                {report.alreadyProcessed
                  ? 'Este resultado já tinha sido registrado; nenhum XP foi somado de novo.'
                  : !summary.passed
                    ? 'Sem XP desta vez. Conclua a missão para receber a recompensa.'
                    : 'Sem XP nesta repetição: missões já concluídas rendem XP ao bater o recorde de precisão ou em revisões espaçadas (a cada 20 horas). A prática continua contando para o domínio dos conceitos.'}
              </p>
            )}
            <div style={{ marginTop: 'var(--space-4)' }}>
              <XpBar value={barValue} label={`Progresso no nível ${after.level}`} />
              <div className="xp-caption">
                <span>Nível {after.level}</span>
                <span>
                  {after.xpIntoLevel}/{after.xpForNext} XP · faltam {after.xpForNext - after.xpIntoLevel}
                </span>
              </div>
            </div>
            <p className={`save-line ${saved ? 'ok' : 'error'}`} role="status">
              <Icon name={saved ? 'check' : 'alert'} size={16} />
              {saved ? 'Progresso salvo neste navegador.' : 'O progresso não foi salvo.'}
              {!saved && (
                <>
                  <button type="button" className="btn small" onClick={() => void store.retrySave()}>
                    Tentar salvar de novo
                  </button>
                  <a className="btn small ghost" href={href('/config')}>
                    Exportar backup
                  </a>
                </>
              )}
            </p>
          </section>

          {(report.achievements.length > 0 || report.sectorsUnlocked.length > 0) && (
            <section className="panel">
              <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Desbloqueios</h2>
              <ul className="unlock-list">
                {report.sectorsUnlocked.map((s) => (
                  <li key={s} className="enter">
                    <Icon name="unlock" /> Novo setor: <strong>{getSector(s).name}</strong>
                  </li>
                ))}
                {report.achievements.map((a) => (
                  <li key={a.id} className="enter">
                    <Icon name="trophy" /> Conquista: <strong>{a.name}</strong>
                    {a.title && <span className="chip accent">título “{a.title}”</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="panel">
            <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>O que fica desta missão</h2>
            <RichText text={mission.debrief} />
          </section>
        </div>

        <aside className="stack">
          <section className="panel">
            <h2 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-3)' }}>Domínio dos conceitos</h2>
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
            <p className="faint" style={{ fontSize: '0.8rem', marginTop: 'var(--space-3)' }}>
              Um conceito só fica “Dominado” com acertos consistentes e uma revisão em outro momento.
            </p>
          </section>
          <section className="panel stack" style={{ gap: 'var(--space-2)' }}>
            {nextRec && (
              <a className="btn primary" href={href(`/missao/${nextRec.mission.id}`)}>
                <Icon name="play" /> Próxima: {nextRec.mission.title}
              </a>
            )}
            <button type="button" className="btn" onClick={onRestart}>
              <Icon name="repeat" /> {summary.passed ? 'Jogar de novo' : 'Tentar de novo'}
            </button>
            <a className="btn ghost" href={href('/missoes')}>
              <Icon name="list" /> Central de missões
            </a>
          </section>
          <p className="faint" style={{ fontSize: '0.8rem' }}>
            Total acumulado: {state.progress.xp} XP
          </p>
        </aside>
      </div>
    </div>
  );
}
