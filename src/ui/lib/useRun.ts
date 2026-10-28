/**
 * Controle de uma execução (missão ou treino) pela interface. Toda decisão passa
 * pelo motor de domain/engine.ts; aqui só guardamos o estado e tocamos sons.
 */
import { useCallback, useRef, useState } from 'react';
import type { MissionDefinition } from '../../content/types';
import { advance, newRunId, revealStep, startRun, submitAnswer, useHint as takeHint, type MissionRun } from '../../domain/engine';
import type { Evaluation, StepAnswer } from '../../domain/evaluators';
import { audio } from '../../services/audio';
import { useStore } from '../../state/GameContext';

export function useRun(mission: MissionDefinition) {
  const store = useStore();
  const [run, setRun] = useState<MissionRun>(() => startRun(mission, newRunId(), store.now()));
  const runRef = useRef(run);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [showHint, setShowHint] = useState(false);

  const update = useCallback((next: MissionRun) => {
    runRef.current = next;
    setRun(next);
  }, []);

  const submit = useCallback(
    (answer: StepAnswer): Evaluation => {
      const current = runRef.current;
      const target = mission.steps[current.stepIndex];
      if (!target) return { correct: false, score: 0, mistakes: 0, messages: [] };
      const result = submitAnswer(current, mission, target.id, answer, store.now());
      update(result.run);
      if (result.accepted) {
        setEvaluation(result.evaluation);
        audio.play(result.evaluation.correct ? 'correct' : 'wrong');
        const progress = result.run.steps[current.stepIndex];
        if (!result.evaluation.correct && progress && progress.failures >= 1) setShowHint(true);
      }
      return result.evaluation;
    },
    [mission, store, update],
  );

  const hint = useCallback(() => {
    const step = mission.steps[runRef.current.stepIndex];
    if (!step) return;
    update(takeHint(runRef.current, step.id));
    setShowHint(true);
  }, [mission, update]);

  const reveal = useCallback(() => {
    const step = mission.steps[runRef.current.stepIndex];
    if (!step) return;
    update(revealStep(runRef.current, step.id, store.now()));
  }, [mission, store, update]);

  /** Avança para a próxima etapa. Devolve true quando não há mais etapas. */
  const next = useCallback((): boolean => {
    const current = runRef.current;
    if (current.stepIndex + 1 < mission.steps.length) {
      update(advance(current, store.now()));
      setEvaluation(null);
      setShowHint(false);
      return false;
    }
    return true;
  }, [mission, store, update]);

  return { run, runRef, evaluation, showHint, submit, hint, reveal, next };
}
