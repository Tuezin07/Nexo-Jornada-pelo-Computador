import { useState } from 'react';
import type { CategoryId } from '../../content/types';
import { CATEGORY_IDS, getCategory } from '../../content/categories';
import { TRAINING_TEXTS } from '../../content/training';
import { newRunId } from '../../domain/engine';
import { buildTrainingSteps, trainingMission, type TrainingMode, type TrainingStepSource } from '../../domain/training';
import type { TrainingReport, TrainingSummary } from '../../domain/progress';
import { TRAINING_DAILY_CAP } from '../../domain/xp';
import { href } from '../../app/router';
import { audio } from '../../services/audio';
import { resolvePlatform } from '../../services/platform';
import { useGame, useStore } from '../../state/GameContext';
import { Icon } from '../components/Icon';
import { EmptyState, StatTile } from '../components/common';
import { StepPanel } from '../components/StepPanel';
import { seededRandom } from '../lib/shuffle';
import { useRun } from '../lib/useRun';
import { pct } from '../lib/format';
import './screens.css';
import './Player.css';

const MODE_LABEL: Record<TrainingMode, string> = {
  digitacao: 'Digitação livre',
  atalhos: 'Circuito de atalhos',
  revisao: 'Revisão por área',
  inteligente: 'Revisão inteligente',
};

const isMode = (m: string): m is TrainingMode => m in MODE_LABEL;

export function TrainingSession({ mode, query }: { mode: string; query: URLSearchParams }) {
  const { state } = useGame();
  const store = useStore();
  const rawCategory = query.get('categoria');
  const category = rawCategory && (CATEGORY_IDS as string[]).includes(rawCategory) ? (rawCategory as CategoryId) : null;
  const [sources] = useState<TrainingStepSource[]>(() =>
    isMode(mode)
      ? buildTrainingSteps(mode, state, store.catalog, seededRandom(store.now()), store.now(), { category, extraTexts: TRAINING_TEXTS })
      : [],
  );

  if (!isMode(mode)) {
    return (
      <div className="page">
        <EmptyState icon="compass" title="Modo de treino desconhecido">
          <a href={href('/treino')}>Voltar ao treino</a>
        </EmptyState>
      </div>
    );
  }
  if (sources.length === 0) {
    return (
      <div className="page">
        <EmptyState icon="dumbbell" title="Ainda não há conteúdo para este treino">
          {mode === 'atalhos'
            ? 'Libere missões com atalhos (como "Teclas essenciais" ou "Copiar, colar, desfazer") para treinar aqui.'
            : 'Libere mais missões na campanha para ampliar o treino.'}{' '}
          <a href={href('/treino')}>Voltar</a>
        </EmptyState>
      </div>
    );
  }
  return <SessionView mode={mode} sources={sources} label={category ? `${MODE_LABEL[mode]} · ${getCategory(category).short}` : MODE_LABEL[mode]} category={category} />;
}

function SessionView({ mode, sources, label, category }: { mode: TrainingMode; sources: TrainingStepSource[]; label: string; category: CategoryId | null }) {
  const store = useStore();
  const { state, save } = useGame();
  const [mission] = useState(() => trainingMission(mode, sources));
  const { run, runRef, evaluation, showHint, submit, hint, reveal, next } = useRun(mission);
  const [result, setResult] = useState<{ report: TrainingReport; saved: boolean; summary: TrainingSummary } | null>(null);
  const [busy, setBusy] = useState(false);
  const platform = resolvePlatform(state.preferences.keyboardPlatform);

  const finish = async () => {
    if (!next()) return;
    setBusy(true);
    const r = runRef.current;
    const typingMetrics = r.steps.find((s) => s.metrics?.wpm !== undefined)?.metrics;
    const summary: TrainingSummary = {
      sessionId: `treino-${newRunId()}`,
      mode,
      label,
      category,
      durationMs: Math.max(0, store.now() - r.startedAt),
      answers: sources.map((s, i) => {
        const p = r.steps[i]!;
        return { concept: s.step.concept, category: s.category, correct: !p.revealed && p.score >= 0.7, firstTry: p.failures === 0 && !p.revealed };
      }),
      ...(typingMetrics ? { typingWpm: typingMetrics.wpm ?? 0, typingAccuracy: typingMetrics.accuracy ?? 0 } : {}),
    };
    const { report, saved } = await store.finishTraining(summary);
    setResult({ report, saved, summary });
    setBusy(false);
    audio.play(report.levelAfter > report.levelBefore ? 'levelup' : 'complete');
  };

  if (result) {
    const correct = result.summary.answers.filter((a) => a.correct).length;
    const firstTry = result.summary.answers.filter((a) => a.correct && a.firstTry).length;
    const isSaved = result.saved || save.status === 'saved';
    return (
      <div className="page">
        <section className="panel hud stack enter">
          <span className="eyebrow accent">Treino concluído</span>
          <h1 style={{ fontSize: 'clamp(1.6rem, 2vw + 1rem, 2.2rem)' }}>{label}</h1>
          <div className="stat-grid">
            <StatTile icon="check" label="Acertos" value={`${correct}/${result.summary.answers.length}`} />
            <StatTile icon="target" label="De primeira" value={firstTry} />
            <StatTile icon="star" label="XP" value={`+${result.report.xp}`} hint={result.report.capReached ? `limite diário de ${TRAINING_DAILY_CAP} XP atingido` : undefined} />
            {result.summary.typingWpm !== undefined && (
              <StatTile icon="keyboard" label="Digitação" value={`${result.summary.typingWpm} ppm`} hint={`precisão ${pct(result.summary.typingAccuracy ?? 0)}`} />
            )}
          </div>
          <p className={`save-line ${isSaved ? 'ok' : 'error'}`} role="status">
            <Icon name={isSaved ? 'check' : 'alert'} size={16} />
            {isSaved ? 'Resultado salvo e somado às suas estatísticas.' : 'O resultado não foi salvo.'}
            {!isSaved && (
              <button type="button" className="btn small" onClick={() => void store.retrySave()}>
                Tentar de novo
              </button>
            )}
          </p>
          <div className="row">
            <a className="btn primary" href={href('/treino')}>
              <Icon name="dumbbell" /> Voltar ao treino
            </a>
            <a className="btn ghost" href={href('/')}>
              Início
            </a>
          </div>
        </section>
      </div>
    );
  }

  const last = run.stepIndex + 1 >= mission.steps.length;
  return (
    <div className="player">
      <header className="player-bar">
        <a className="btn ghost small" href={href('/treino')}>
          <Icon name="x" size={16} /> Sair
        </a>
        <div className="player-title">
          <span className="eyebrow accent">Treino</span>
          <strong>{label}</strong>
        </div>
        <ol className="step-track" aria-label={`Exercício ${run.stepIndex + 1} de ${mission.steps.length}`}>
          {mission.steps.map((s, i) => {
            const p = run.steps[i]!;
            return <li key={s.id} className={p.completed ? (p.revealed ? 'revealed' : 'done') : i === run.stepIndex ? 'current' : ''} />;
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
        onNext={() => void finish()}
        busy={busy}
        label="Exercício"
        nextLabel={
          last ? (
            <>
              Concluir treino <Icon name="flag" />
            </>
          ) : (
            <>
              Próximo <Icon name="arrow-right" />
            </>
          )
        }
      />
    </div>
  );
}
