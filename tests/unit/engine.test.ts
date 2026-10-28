import { describe, expect, it } from 'vitest';
import type { MissionDefinition, TypingStep } from '../../src/content/types';
import {
  HINT_FACTOR,
  PASS_THRESHOLD,
  REVEAL_AFTER_FAILURES,
  advance,
  attemptFactor,
  canAdvance,
  canReveal,
  currentStep,
  getStepProgress,
  isRunComplete,
  revealStep,
  startRun,
  submitAnswer,
  summarizeRun,
  useHint as applyHint,
  type MissionRun,
} from '../../src/domain/engine';
import { MINUTE, T0, makeMission, playQuizMission, quizStep } from '../helpers/fixtures';

const mission = makeMission({ id: 'm-motor', concepts: ['teclas-essenciais', 'mouse-acoes'] });
const [s1, s2, s3] = mission.steps as [MissionDefinition['steps'][number], MissionDefinition['steps'][number], MissionDefinition['steps'][number]];

const right = { kind: 'quiz' as const, selected: ['a'] };
const wrong = { kind: 'quiz' as const, selected: ['b'] };
const empty = { kind: 'quiz' as const, selected: [] };

function answer(run: MissionRun, stepId: string, a: typeof right, now = T0) {
  return submitAnswer(run, mission, stepId, a, now).run;
}

describe('startRun', () => {
  it('cria uma execução na primeira etapa, sem progresso', () => {
    const run = startRun(mission, 'run-1', T0);
    expect(run).toMatchObject({ runId: 'run-1', missionId: 'm-motor', contentVersion: 1, startedAt: T0, stepIndex: 0 });
    expect(run.steps).toHaveLength(3);
    expect(run.steps.every((s) => !s.completed && s.attempts === 0 && s.failures === 0)).toBe(true);
    expect(run.steps.map((s) => s.firstSeenAt)).toEqual([T0, null, null]);
    expect(currentStep(run, mission)?.id).toBe(s1.id);
    expect(canAdvance(run)).toBe(false);
  });
});

describe('fator de tentativas', () => {
  it('cai 20% por falha, com piso de 50%', () => {
    expect(attemptFactor(0)).toBe(1);
    expect(attemptFactor(1)).toBeCloseTo(0.8);
    expect(attemptFactor(2)).toBeCloseTo(0.6);
    expect(attemptFactor(3)).toBe(0.5);
    expect(attemptFactor(10)).toBe(0.5);
  });

  it('acerto de primeira vale 1; depois de uma falha, 0,8; depois de duas, 0,6', () => {
    let run = startRun(mission, 'r', T0);
    run = answer(run, s1.id, right, T0 + 1000);
    expect(getStepProgress(run, s1.id)).toMatchObject({ completed: true, score: 1, attempts: 1, failures: 0, completedAt: T0 + 1000 });

    run = answer(run, s2.id, wrong);
    expect(getStepProgress(run, s2.id)).toMatchObject({ completed: false, failures: 1, mistakes: 1 });
    run = answer(run, s2.id, right);
    expect(getStepProgress(run, s2.id)!.score).toBe(0.8);

    run = answer(answer(run, s3.id, wrong), s3.id, wrong);
    run = answer(run, s3.id, right);
    expect(getStepProgress(run, s3.id)).toMatchObject({ score: 0.6, attempts: 3, failures: 2, mistakes: 2 });
  });

  it('resposta incompleta não conta como falha', () => {
    const run = answer(startRun(mission, 'r', T0), s1.id, empty);
    expect(getStepProgress(run, s1.id)).toMatchObject({ attempts: 1, failures: 0, completed: false });
  });

  it('resposta de outro formato não conta como falha', () => {
    const result = submitAnswer(startRun(mission, 'r', T0), mission, s1.id, { kind: 'order', order: ['a'] }, T0);
    expect(result.evaluation.correct).toBe(false);
    expect(getStepProgress(result.run, s1.id)!.failures).toBe(0);
  });

  it('etapa inexistente é recusada sem alterar a execução', () => {
    const run = startRun(mission, 'r', T0);
    const result = submitAnswer(run, mission, 'nao-existe', right, T0);
    expect(result.accepted).toBe(false);
    expect(result.run).toBe(run);
  });
});

describe('pistas', () => {
  it('usar a pista reduz a nota da etapa', () => {
    expect(HINT_FACTOR).toBe(0.9);
    let run = applyHint(startRun(mission, 'r', T0), s1.id);
    expect(getStepProgress(run, s1.id)!.hintUsed).toBe(true);
    run = answer(run, s1.id, right);
    expect(getStepProgress(run, s1.id)!.score).toBe(0.9);
  });

  it('pista e falha se combinam', () => {
    let run = answer(startRun(mission, 'r', T0), s1.id, wrong);
    run = applyHint(run, s1.id);
    run = answer(run, s1.id, right);
    expect(getStepProgress(run, s1.id)!.score).toBe(0.72);
  });

  it('pedir pista numa etapa já concluída não muda nada', () => {
    let run = answer(startRun(mission, 'r', T0), s1.id, right);
    run = applyHint(run, s1.id);
    expect(getStepProgress(run, s1.id)).toMatchObject({ hintUsed: false, score: 1 });
  });
});

describe('revelar a solução', () => {
  it(`só depois de ${REVEAL_AFTER_FAILURES} falhas`, () => {
    let run = startRun(mission, 'r', T0);
    expect(canReveal(run, s1.id)).toBe(false);
    expect(revealStep(run, s1.id, T0)).toBe(run);

    run = answer(run, s1.id, wrong);
    expect(canReveal(run, s1.id)).toBe(false);
    expect(revealStep(run, s1.id, T0)).toBe(run);

    run = answer(run, s1.id, wrong);
    expect(canReveal(run, s1.id)).toBe(true);
    run = revealStep(run, s1.id, T0 + 5);
    expect(getStepProgress(run, s1.id)).toMatchObject({ completed: true, revealed: true, score: 0, completedAt: T0 + 5 });
    expect(canReveal(run, s1.id)).toBe(false);
  });

  it('respostas vazias não liberam a solução', () => {
    let run = startRun(mission, 'r', T0);
    run = answer(answer(answer(run, s1.id, empty), s1.id, empty), s1.id, empty);
    expect(canReveal(run, s1.id)).toBe(false);
  });
});

describe('etapa concluída', () => {
  it('ignora novas respostas', () => {
    const run = answer(startRun(mission, 'r', T0), s1.id, right);
    const again = submitAnswer(run, mission, s1.id, wrong, T0 + 10);
    expect(again.accepted).toBe(false);
    expect(again.run).toBe(run);
    expect(getStepProgress(again.run, s1.id)).toMatchObject({ score: 1, attempts: 1, mistakes: 0 });
  });

  it('não volta a ser concluída depois de revelada', () => {
    let run = answer(answer(startRun(mission, 'r', T0), s1.id, wrong), s1.id, wrong);
    run = revealStep(run, s1.id, T0);
    const after = submitAnswer(run, mission, s1.id, right, T0);
    expect(after.accepted).toBe(false);
    expect(getStepProgress(after.run, s1.id)!.score).toBe(0);
  });
});

describe('advance', () => {
  it('só avança com a etapa atual concluída e marca quando a próxima foi vista', () => {
    let run = startRun(mission, 'r', T0);
    expect(advance(run, T0)).toBe(run);
    run = answer(run, s1.id, right);
    expect(canAdvance(run)).toBe(true);
    run = advance(run, T0 + MINUTE);
    expect(run.stepIndex).toBe(1);
    expect(getStepProgress(run, s2.id)!.firstSeenAt).toBe(T0 + MINUTE);
    expect(currentStep(run, mission)?.id).toBe(s2.id);
    expect(advance(run, T0 + MINUTE)).toBe(run);
  });
});

describe('summarizeRun', () => {
  it('não resume uma execução incompleta', () => {
    let run = startRun(mission, 'r', T0);
    run = answer(answer(run, s1.id, right), s2.id, right);
    expect(isRunComplete(run)).toBe(false);
    expect(summarizeRun(run, mission, T0)).toBeNull();
  });

  it('não resume com a missão errada', () => {
    let run = startRun(mission, 'r', T0);
    for (const s of mission.steps) run = answer(run, s.id, right);
    expect(summarizeRun(run, makeMission({ id: 'outra' }), T0)).toBeNull();
  });

  it('missão perfeita: precisão 1, aprovada e sem arranhões', () => {
    const summary = playQuizMission(mission, 'run-ok', T0, T0 + 4 * MINUTE);
    expect(summary).toMatchObject({
      runId: 'run-ok',
      missionId: 'm-motor',
      accuracy: 1,
      passed: true,
      flawless: true,
      mistakes: 0,
      revealedSteps: 0,
      firstTrySteps: 3,
      totalSteps: 3,
      durationMs: 4 * MINUTE,
      startedAt: T0,
      finishedAt: T0 + 4 * MINUTE,
    });
    expect(summary.conceptResults).toEqual([
      { concept: 'teclas-essenciais', correct: true, firstTry: true },
      { concept: 'mouse-acoes', correct: true, firstTry: true },
      { concept: 'teclas-essenciais', correct: true, firstTry: true },
    ]);
    expect(summary.stepKinds).toEqual([
      { kind: 'quiz', correct: true },
      { kind: 'quiz', correct: true },
      { kind: 'quiz', correct: true },
    ]);
    expect(summary.typing).toBeUndefined();
  });

  it('um erro tira o "sem arranhões" e entra nas estatísticas', () => {
    const summary = playQuizMission(mission, 'r', T0, T0, { wrongFirst: [1] });
    expect(summary.flawless).toBe(false);
    expect(summary.mistakes).toBe(1);
    expect(summary.firstTrySteps).toBe(2);
    expect(summary.accuracy).toBeCloseTo((1 + 0.8 + 1) / 3, 3);
    expect(summary.passed).toBe(true);
    expect(summary.conceptResults[1]).toEqual({ concept: 'mouse-acoes', correct: true, firstTry: false });
  });

  it('usar pista tira o "sem arranhões" mesmo acertando de primeira', () => {
    const summary = playQuizMission(mission, 'r', T0, T0, { hint: [0] });
    expect(summary.mistakes).toBe(0);
    expect(summary.flawless).toBe(false);
  });

  it('etapa revelada não conta como acerto do conceito', () => {
    const summary = playQuizMission(mission, 'r', T0, T0, { reveal: [2] });
    expect(summary.revealedSteps).toBe(1);
    expect(summary.conceptResults[2]).toEqual({ concept: 'teclas-essenciais', correct: false, firstTry: false });
    expect(summary.stepKinds[2]).toEqual({ kind: 'quiz', correct: false });
    expect(summary.accuracy).toBeCloseTo(2 / 3, 3);
    expect(summary.passed).toBe(true);
  });

  it(`aprovação com limiar ${PASS_THRESHOLD}`, () => {
    const five = makeMission({ id: 'cinco', stepCount: 5 });
    const atThreshold = playQuizMission(five, 'r1', T0, T0, { reveal: [3, 4] });
    expect(atThreshold.accuracy).toBe(0.6);
    expect(atThreshold.passed).toBe(true);

    const below = playQuizMission(five, 'r2', T0, T0, { reveal: [3, 4], wrongFirst: [2] });
    expect(below.accuracy).toBeCloseTo(0.56, 3);
    expect(below.passed).toBe(false);
  });

  it('duração nunca negativa', () => {
    const summary = playQuizMission(mission, 'r', T0, T0 - 1000);
    expect(summary.durationMs).toBe(0);
  });

  it('inclui velocidade e precisão de digitação', () => {
    const typing: TypingStep = {
      kind: 'typing',
      id: 'dig',
      title: 'Digitação',
      prompt: 'Digite',
      hint: 'h',
      explanation: 'e',
      concept: 'digitacao-precisao',
      text: 'abcdefghij',
      minAccuracy: 0.8,
    };
    const m = makeMission({ id: 'm-dig', steps: [quizStep('q1'), typing] });
    let run = startRun(m, 'r', T0);
    run = submitAnswer(run, m, 'q1', right, T0).run;
    // 10 caracteres em 12 s = 10 ppm; 1 erro em 11 teclas
    const log = [...'abcdefghij'].map((ch, i) => ({ ch, t: i === 9 ? 12_000 : i * 1000 }));
    log.splice(3, 0, { ch: 'x', t: 2500 });
    run = submitAnswer(run, m, 'dig', { kind: 'typing', log }, T0).run;
    const summary = summarizeRun(run, m, T0 + MINUTE)!;
    expect(summary.typing).toBeDefined();
    expect(summary.typing!.wpm).toBe(10);
    expect(summary.typing!.accuracy).toBeCloseTo(10 / 11, 5);
  });
});
