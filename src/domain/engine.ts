/**
 * Motor de missões: controla uma execução ("run") do início ao resumo final.
 *
 * Regras:
 * - Uma etapa só é concluída quando o avaliador diz que está correta, ou quando o
 *   jogador pede para ver a solução depois de errar (`REVEAL_AFTER_FAILURES`).
 * - A pontuação da etapa = qualidade da resposta × fator de tentativas × fator de pista.
 * - A missão é aprovada se todas as etapas foram concluídas e a precisão média
 *   atinge `PASS_THRESHOLD`.
 * - Cada run tem um `runId` único; a recompensa é concedida no máximo uma vez por run
 *   (ver `progress.ts`).
 */
import type { ChallengeStep, MissionDefinition } from '../content/types';
import type { ConceptId as Concept } from '../content/concepts';
import { evaluateStep, type Evaluation, type StepAnswer } from './evaluators';

export const PASS_THRESHOLD = 0.6;
export const REVEAL_AFTER_FAILURES = 2;
export const HINT_FACTOR = 0.9;

export interface StepProgress {
  stepId: string;
  attempts: number;
  failures: number;
  mistakes: number;
  hintUsed: boolean;
  revealed: boolean;
  completed: boolean;
  /** Pontuação final da etapa (0..1); só faz sentido quando concluída. */
  score: number;
  metrics?: Record<string, number>;
  firstSeenAt: number | null;
  completedAt: number | null;
}

export interface MissionRun {
  runId: string;
  missionId: string;
  contentVersion: number;
  startedAt: number;
  stepIndex: number;
  steps: StepProgress[];
}

export interface ConceptResult {
  concept: Concept;
  correct: boolean;
  firstTry: boolean;
}

export interface RunSummary {
  runId: string;
  missionId: string;
  contentVersion: number;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  accuracy: number;
  passed: boolean;
  flawless: boolean;
  mistakes: number;
  revealedSteps: number;
  firstTrySteps: number;
  totalSteps: number;
  conceptResults: ConceptResult[];
  stepKinds: { kind: ChallengeStep['kind']; correct: boolean }[];
  typing?: { wpm: number; accuracy: number };
}

export function attemptFactor(failures: number): number {
  return Math.max(0.5, 1 - 0.2 * failures);
}

export function startRun(mission: MissionDefinition, runId: string, now: number): MissionRun {
  return {
    runId,
    missionId: mission.id,
    contentVersion: mission.version,
    startedAt: now,
    stepIndex: 0,
    steps: mission.steps.map((s, index) => ({
      stepId: s.id,
      attempts: 0,
      failures: 0,
      mistakes: 0,
      hintUsed: false,
      revealed: false,
      completed: false,
      score: 0,
      firstSeenAt: index === 0 ? now : null,
      completedAt: null,
    })),
  };
}

function updateStep(run: MissionRun, stepId: string, update: (s: StepProgress) => StepProgress): MissionRun {
  return { ...run, steps: run.steps.map((s) => (s.stepId === stepId ? update(s) : s)) };
}

export function getStepProgress(run: MissionRun, stepId: string): StepProgress | undefined {
  return run.steps.find((s) => s.stepId === stepId);
}

export interface SubmitResult {
  run: MissionRun;
  evaluation: Evaluation;
  /** false quando a resposta foi ignorada (etapa já concluída). */
  accepted: boolean;
}

export function submitAnswer(
  run: MissionRun,
  mission: MissionDefinition,
  stepId: string,
  answer: StepAnswer,
  now: number,
): SubmitResult {
  const step = mission.steps.find((s) => s.id === stepId);
  const progress = getStepProgress(run, stepId);
  if (!step || !progress) {
    return { run, accepted: false, evaluation: { correct: false, score: 0, mistakes: 0, messages: ['Etapa inexistente.'] } };
  }
  if (progress.completed) {
    return { run, accepted: false, evaluation: { correct: true, score: progress.score, mistakes: 0, messages: [] } };
  }
  const evaluation = evaluateStep(step, answer);
  const next = updateStep(run, stepId, (s) => {
    const attempts = s.attempts + 1;
    const mistakes = s.mistakes + evaluation.mistakes;
    const metrics = evaluation.metrics ?? s.metrics;
    if (evaluation.correct) {
      const score = evaluation.score * attemptFactor(s.failures) * (s.hintUsed ? HINT_FACTOR : 1);
      return { ...s, attempts, mistakes, completed: true, score: Math.round(score * 1000) / 1000, completedAt: now, ...(metrics ? { metrics } : {}) };
    }
    // Respostas incompletas (ex.: nenhum item marcado) não contam como falha.
    const counted = evaluation.mistakes > 0 || evaluation.score > 0;
    return { ...s, attempts, mistakes, failures: s.failures + (counted ? 1 : 0), ...(metrics ? { metrics } : {}) };
  });
  return { run: next, evaluation, accepted: true };
}

export function useHint(run: MissionRun, stepId: string): MissionRun {
  return updateStep(run, stepId, (s) => (s.completed ? s : { ...s, hintUsed: true }));
}

export function canReveal(run: MissionRun, stepId: string): boolean {
  const s = getStepProgress(run, stepId);
  return Boolean(s && !s.completed && s.failures >= REVEAL_AFTER_FAILURES);
}

export function revealStep(run: MissionRun, stepId: string, now: number): MissionRun {
  if (!canReveal(run, stepId)) return run;
  return updateStep(run, stepId, (s) => ({ ...s, completed: true, revealed: true, score: 0, completedAt: now }));
}

export function currentStep(run: MissionRun, mission: MissionDefinition): ChallengeStep | undefined {
  return mission.steps[run.stepIndex];
}

export function canAdvance(run: MissionRun): boolean {
  return Boolean(run.steps[run.stepIndex]?.completed);
}

export function advance(run: MissionRun, now: number): MissionRun {
  if (!canAdvance(run) || run.stepIndex >= run.steps.length) return run;
  const stepIndex = run.stepIndex + 1;
  return {
    ...run,
    stepIndex,
    steps: run.steps.map((s, i) => (i === stepIndex && s.firstSeenAt === null ? { ...s, firstSeenAt: now } : s)),
  };
}

export function isRunComplete(run: MissionRun): boolean {
  return run.steps.every((s) => s.completed);
}

export function summarizeRun(run: MissionRun, mission: MissionDefinition, now: number): RunSummary | null {
  if (!isRunComplete(run) || run.missionId !== mission.id) return null;
  const totalSteps = run.steps.length;
  const accuracy = run.steps.reduce((sum, s) => sum + s.score, 0) / Math.max(1, totalSteps);
  const mistakes = run.steps.reduce((sum, s) => sum + s.mistakes, 0);
  const revealedSteps = run.steps.filter((s) => s.revealed).length;
  const firstTrySteps = run.steps.filter((s) => s.failures === 0 && !s.revealed).length;
  const conceptResults: ConceptResult[] = mission.steps.map((step, i) => {
    const s = run.steps[i]!;
    return { concept: step.concept, correct: !s.revealed && s.score >= 0.7, firstTry: s.failures === 0 && !s.revealed };
  });
  const typingSteps = mission.steps
    .map((step, i) => ({ step, progress: run.steps[i]! }))
    .filter(({ step, progress }) => step.kind === 'typing' && progress.metrics && !progress.revealed);
  const typing =
    typingSteps.length > 0
      ? {
          wpm: Math.max(...typingSteps.map(({ progress }) => progress.metrics!.wpm ?? 0)),
          accuracy: typingSteps.reduce((sum, { progress }) => sum + (progress.metrics!.accuracy ?? 0), 0) / typingSteps.length,
        }
      : undefined;
  return {
    runId: run.runId,
    missionId: run.missionId,
    contentVersion: run.contentVersion,
    startedAt: run.startedAt,
    finishedAt: now,
    durationMs: Math.max(0, now - run.startedAt),
    accuracy: Math.round(accuracy * 1000) / 1000,
    passed: accuracy >= PASS_THRESHOLD,
    flawless: revealedSteps === 0 && mistakes === 0 && run.steps.every((s) => s.failures === 0 && !s.hintUsed),
    mistakes,
    revealedSteps,
    firstTrySteps,
    totalSteps,
    conceptResults,
    stepKinds: mission.steps.map((step, i) => ({ kind: step.kind, correct: !run.steps[i]!.revealed })),
    ...(typing ? { typing } : {}),
  };
}

export function newRunId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
