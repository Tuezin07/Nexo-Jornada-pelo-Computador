/**
 * Avaliadores de etapas. Funções puras: recebem a definição da etapa e a resposta
 * do jogador (ou o estado final da simulação) e decidem se está correto.
 *
 * Para adicionar um novo formato: crie o tipo em content/types.ts, a resposta em
 * `StepAnswer`, um avaliador aqui e registre em `EVALUATORS`. O TypeScript aponta
 * o que falta.
 */
import type {
  ChallengeStep,
  ClassifyStep,
  DiagnosisStep,
  FilesystemStep,
  FsGoal,
  InspectStep,
  KeyCombo,
  OrderStep,
  QuizStep,
  SettingCondition,
  SettingsStep,
  ShortcutStep,
  StepKind,
  StepOfKind,
  TerminalGoal,
  TerminalStep,
  TypingStep,
} from '../content/types';
import { childrenOf, extensionOf, isInTrash, resolvePath, trashItems, normalizeName, type FsState } from './sim/fs';
import { comboEquals, expectedCombos, formatCombo, type Platform } from './sim/keys';
import type { ShellState } from './sim/shell';

export type SettingValue = boolean | string | number;

export interface TypingKey {
  ch: string;
  t: number;
}

export type StepAnswer =
  | { kind: 'quiz'; selected: string[] }
  | { kind: 'order'; order: string[] }
  | { kind: 'classify'; placement: Record<string, string> }
  | { kind: 'shortcut'; pressed: KeyCombo[]; platform: Platform }
  | { kind: 'typing'; log: TypingKey[] }
  | { kind: 'filesystem'; state: FsState }
  | { kind: 'terminal'; state: ShellState }
  | { kind: 'settings'; values: Record<string, SettingValue> }
  | { kind: 'diagnosis'; trace: string[] }
  | { kind: 'inspect'; flagged: string[]; verdict: string | null };

export type AnswerOfKind<K extends StepKind> = Extract<StepAnswer, { kind: K }>;

export interface Evaluation {
  correct: boolean;
  /** Qualidade da resposta, 0..1. */
  score: number;
  /** Erros cometidos nesta resposta (para estatísticas). */
  mistakes: number;
  /** Mensagens de retorno ao jogador, em ordem de importância. */
  messages: string[];
  metrics?: Record<string, number>;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// --- Escolha ----------------------------------------------------------------

export function evaluateQuiz(step: QuizStep, answer: AnswerOfKind<'quiz'>): Evaluation {
  const selected = new Set(answer.selected);
  const options = step.options.filter((o) => selected.has(o.id));
  if (options.length === 0) return { correct: false, score: 0, mistakes: 0, messages: ['Escolha uma alternativa.'] };
  if (!step.multiple) {
    const option = options[0]!;
    const correct = Boolean(option.correct) && options.length === 1;
    return { correct, score: correct ? 1 : 0, mistakes: correct ? 0 : 1, messages: [option.feedback] };
  }
  const correctIds = step.options.filter((o) => o.correct).map((o) => o.id);
  const wrong = options.filter((o) => !o.correct);
  const hits = options.filter((o) => o.correct).length;
  const missing = correctIds.length - hits;
  const correct = wrong.length === 0 && missing === 0;
  const messages = wrong.map((o) => o.feedback);
  if (missing > 0) messages.push(`Ainda falta marcar ${missing === 1 ? 'uma alternativa correta' : `${missing} alternativas corretas`}.`);
  if (correct) messages.push(...options.map((o) => o.feedback));
  return {
    correct,
    score: correct ? 1 : clamp01((hits - wrong.length) / correctIds.length),
    mistakes: wrong.length + missing,
    messages,
  };
}

export function evaluateOrder(step: OrderStep, answer: AnswerOfKind<'order'>): Evaluation {
  const expected = step.items.map((i) => i.id);
  const inPlace = expected.filter((id, index) => answer.order[index] === id).length;
  const correct = inPlace === expected.length && answer.order.length === expected.length;
  return {
    correct,
    score: clamp01(inPlace / expected.length),
    mistakes: correct ? 0 : 1,
    messages: correct ? [] : [`${inPlace} de ${expected.length} etapas estão na posição certa.`],
  };
}

export function evaluateClassify(step: ClassifyStep, answer: AnswerOfKind<'classify'>): Evaluation {
  const unplaced = step.items.filter((i) => !answer.placement[i.id]);
  if (unplaced.length > 0) {
    return {
      correct: false,
      score: 0,
      mistakes: 0,
      messages: [`Ainda há ${unplaced.length === 1 ? 'um item' : `${unplaced.length} itens`} sem grupo.`],
    };
  }
  const wrong = step.items.filter((i) => answer.placement[i.id] !== i.bucket);
  return {
    correct: wrong.length === 0,
    score: clamp01((step.items.length - wrong.length) / step.items.length),
    mistakes: wrong.length,
    messages: wrong.map((i) => `“${i.text}”: ${i.feedback}`),
  };
}

// --- Teclado ----------------------------------------------------------------

export function evaluateShortcut(step: ShortcutStep, answer: AnswerOfKind<'shortcut'>): Evaluation {
  const expected = expectedCombos(step, answer.platform);
  const firstWrong = answer.pressed.findIndex((combo, index) => !expected[index] || !comboEquals(combo, expected[index]!));
  if (firstWrong !== -1) {
    const pressed = answer.pressed[firstWrong]!;
    return {
      correct: false,
      score: 0,
      mistakes: 1,
      messages: [`Você usou ${formatCombo(pressed, answer.platform)}, que não é o atalho pedido aqui.`],
    };
  }
  if (answer.pressed.length < expected.length) {
    return { correct: false, score: 0, mistakes: 0, messages: ['A sequência ainda não terminou.'] };
  }
  return { correct: true, score: 1, mistakes: 0, messages: [] };
}

export interface TypingReplay {
  position: number;
  keystrokes: number;
  mistakes: number;
  accuracy: number;
  durationMs: number;
  wpm: number;
  completed: boolean;
}

/**
 * Teto de velocidade humanamente plausível (recordes sustentados ficam perto de 200 ppm).
 * Evita que digitação automatizada gere recordes e conquistas absurdos.
 */
export const MAX_PLAUSIBLE_WPM = 250;

/** Reproduz o registro de teclas no modo "para no erro". */
export function replayTyping(text: string, log: TypingKey[]): TypingReplay {
  let position = 0;
  let mistakes = 0;
  for (const key of log) {
    if (position >= text.length) break;
    if (key.ch === text[position]) position++;
    else mistakes++;
  }
  const keystrokes = log.length;
  const durationMs = log.length > 1 ? Math.max(0, log[log.length - 1]!.t - log[0]!.t) : 0;
  const minutes = durationMs / 60000;
  return {
    position,
    keystrokes,
    mistakes,
    accuracy: keystrokes > 0 ? (keystrokes - mistakes) / keystrokes : 0,
    durationMs,
    wpm: minutes > 0 ? Math.min(MAX_PLAUSIBLE_WPM, Math.round(position / 5 / minutes)) : 0,
    completed: position >= text.length,
  };
}

export function evaluateTyping(step: TypingStep, answer: AnswerOfKind<'typing'>): Evaluation {
  const replay = replayTyping(step.text, answer.log);
  const metrics = {
    wpm: replay.wpm,
    accuracy: replay.accuracy,
    mistakes: replay.mistakes,
    durationMs: replay.durationMs,
  };
  if (!replay.completed) {
    return { correct: false, score: 0, mistakes: replay.mistakes, messages: ['Termine o texto para concluir.'], metrics };
  }
  // Arredonda para baixo: 89,6% nunca aparece como "90%" quando a meta é 90%.
  const pct = Math.floor(replay.accuracy * 100);
  const goal = Math.round(step.minAccuracy * 100);
  const correct = replay.accuracy >= step.minAccuracy;
  const messages = correct
    ? [`Precisão de ${pct}% a ${replay.wpm} palavras por minuto.`]
    : [`Precisão de ${pct}%; a meta é ${goal}%. Vá com calma: a velocidade vem depois da precisão.`];
  if (correct && step.targetWpm && replay.wpm < step.targetWpm) {
    messages.push(`Meta de velocidade (${step.targetWpm} ppm) ainda não alcançada; ela vem com a prática.`);
  }
  return { correct, score: clamp01(replay.accuracy), mistakes: replay.mistakes, messages, metrics };
}

// --- Simulações ---------------------------------------------------------------

export function checkFsGoal(state: FsState, goal: FsGoal | TerminalGoal): boolean {
  switch (goal.type) {
    case 'exists': {
      const id = resolvePath(state, goal.path);
      if (!id) return false;
      return !goal.nodeType || state.items[id]!.type === goal.nodeType;
    }
    case 'notExists':
      return resolvePath(state, goal.path) === null;
    case 'inTrash':
      return trashItems(state).some((i) => normalizeName(i.name) === normalizeName(goal.name));
    case 'notInTrash':
      return !trashItems(state).some((i) => normalizeName(i.name) === normalizeName(goal.name));
    case 'opened': {
      const id = resolvePath(state, goal.path);
      return id !== null && state.opened.includes(id);
    }
    case 'trashEmpty':
      return state.trashEmptied && state.trash.length === 0;
    case 'countInFolder': {
      const id = resolvePath(state, goal.path);
      if (!id || isInTrash(state, id)) return false;
      const ext = goal.extension.replace(/^\./, '').toLowerCase();
      return childrenOf(state, id).filter((c) => c.type === 'file' && extensionOf(c.name) === ext).length === goal.count;
    }
    default:
      return false;
  }
}

export function fsGoalStatus(step: FilesystemStep, state: FsState): boolean[] {
  return step.goals.map((goal) => checkFsGoal(state, goal));
}

export function evaluateFilesystem(step: FilesystemStep, answer: AnswerOfKind<'filesystem'>): Evaluation {
  const status = fsGoalStatus(step, answer.state);
  const missing = step.goals.filter((_, i) => !status[i]);
  const violations = answer.state.violations;
  const messages = missing.map((g) => `Ainda falta: ${g.label}`);
  if (violations > 0) messages.push(`Você tentou mexer em ${violations === 1 ? 'um item protegido' : `${violations} itens protegidos`}.`);
  return {
    correct: missing.length === 0,
    score: clamp01(1 - 0.15 * violations),
    mistakes: violations,
    messages,
  };
}

export function terminalGoalStatus(step: TerminalStep, state: ShellState): boolean[] {
  return step.goals.map((goal) => {
    if (goal.type === 'cwd') return state.cwd === resolvePath(state.fs, goal.path);
    if (goal.type === 'ran') {
      return state.history.some(
        (h) =>
          h.ok &&
          h.command === goal.command &&
          (!goal.argIncludes || h.args.join(' ').toLowerCase().includes(goal.argIncludes.toLowerCase())),
      );
    }
    return checkFsGoal(state.fs, goal);
  });
}

export function evaluateTerminal(step: TerminalStep, answer: AnswerOfKind<'terminal'>): Evaluation {
  const status = terminalGoalStatus(step, answer.state);
  const missing = step.goals.filter((_, i) => !status[i]);
  const violations = answer.state.fs.violations;
  return {
    correct: missing.length === 0,
    score: clamp01(1 - 0.15 * violations),
    mistakes: violations,
    messages: missing.map((g) => `Ainda falta: ${g.label}`),
  };
}

export function checkSetting(condition: SettingCondition, values: Record<string, SettingValue>): boolean {
  const value = values[condition.control];
  if (condition.op === 'eq') return value === condition.value;
  if (typeof value !== 'number') return false;
  return condition.op === 'gte' ? value >= condition.value : value <= condition.value;
}

export function initialSettingValues(step: SettingsStep): Record<string, SettingValue> {
  const values: Record<string, SettingValue> = {};
  for (const panel of step.panels) for (const group of panel.groups) for (const c of group.controls) values[c.id] = c.initial;
  return values;
}

export function evaluateSettings(step: SettingsStep, answer: AnswerOfKind<'settings'>): Evaluation {
  const missing = step.goals.filter((g) => !checkSetting(g, answer.values));
  const forbidden = (step.forbidden ?? []).filter((f) => checkSetting(f, answer.values));
  return {
    correct: missing.length === 0 && forbidden.length === 0,
    score: clamp01(1 - 0.3 * forbidden.length),
    mistakes: missing.length + forbidden.length,
    messages: [...forbidden.map((f) => f.reason), ...missing.map((g) => `Ainda falta: ${g.label}`)],
  };
}

export interface DiagnosisReplay {
  stageId: string;
  resolved: boolean;
  counts: { best: number; good: number; poor: number; harmful: number };
  /** Ações já tentadas na fase atual (para desabilitar na interface). */
  triedInStage: string[];
}

export function replayDiagnosis(step: DiagnosisStep, trace: string[]): DiagnosisReplay {
  const stages = new Map(step.stages.map((s) => [s.id, s]));
  let stageId = step.startStage;
  let resolved = false;
  let triedInStage: string[] = [];
  const counts = { best: 0, good: 0, poor: 0, harmful: 0 };
  for (const actionId of trace) {
    if (resolved) break;
    const action = stages.get(stageId)?.actions.find((a) => a.id === actionId);
    if (!action || triedInStage.includes(actionId)) continue;
    counts[action.quality]++;
    if (action.quality === 'best' || action.quality === 'good') {
      if (action.resolves) resolved = true;
      else if (action.next) {
        stageId = action.next;
        triedInStage = [];
        continue;
      }
    }
    triedInStage.push(actionId);
  }
  return { stageId, resolved, counts, triedInStage };
}

export function evaluateDiagnosis(step: DiagnosisStep, answer: AnswerOfKind<'diagnosis'>): Evaluation {
  const replay = replayDiagnosis(step, answer.trace);
  const { good, poor, harmful } = replay.counts;
  const score = clamp01(1 - 0.1 * good - 0.15 * poor - 0.35 * harmful);
  const messages: string[] = [];
  if (!replay.resolved) messages.push('O problema ainda não foi resolvido.');
  if (harmful > 0) {
    messages.push(
      `${harmful === 1 ? 'Uma ação arriscada foi escolhida' : `${harmful} ações arriscadas foram escolhidas`}. Em um computador real, ela${harmful === 1 ? '' : 's'} poderia${harmful === 1 ? '' : 'm'} causar perda de dados ou expor você.`,
    );
  }
  if (poor > 0) messages.push(`${poor} tentativa(s) não ajudaram neste momento.`);
  return { correct: replay.resolved, score, mistakes: poor + harmful, messages, metrics: { ...replay.counts } };
}

export function evaluateInspect(step: InspectStep, answer: AnswerOfKind<'inspect'>): Evaluation {
  const flagged = new Set(answer.flagged);
  const suspicious = step.parts.filter((p) => p.suspicious);
  const found = suspicious.filter((p) => flagged.has(p.id));
  const falseFlags = step.parts.filter((p) => !p.suspicious && flagged.has(p.id));
  const verdict = step.verdict.options.find((o) => o.id === answer.verdict);
  const verdictCorrect = Boolean(verdict?.correct);
  const messages: string[] = [];
  if (found.length < step.minFlags) {
    messages.push(`Você marcou ${found.length} sinal(is) de alerta; procure pelo menos ${step.minFlags}.`);
  }
  for (const part of falseFlags) messages.push(`${part.field}: ${part.explanation}`);
  if (!verdict) messages.push('Dê o seu veredito.');
  else if (!verdictCorrect) messages.push(verdict.feedback);
  const score = clamp01((found.length / Math.max(1, suspicious.length)) * 0.6 + (verdictCorrect ? 0.4 : 0) - 0.1 * falseFlags.length);
  return {
    correct: found.length >= step.minFlags && verdictCorrect,
    score,
    mistakes: falseFlags.length + (verdict && !verdictCorrect ? 1 : 0) + Math.max(0, step.minFlags - found.length),
    messages,
  };
}

// --- Registro -----------------------------------------------------------------

type EvaluatorMap = { [K in StepKind]: (step: StepOfKind<K>, answer: AnswerOfKind<K>) => Evaluation };

export const EVALUATORS: EvaluatorMap = {
  quiz: evaluateQuiz,
  order: evaluateOrder,
  classify: evaluateClassify,
  shortcut: evaluateShortcut,
  typing: evaluateTyping,
  filesystem: evaluateFilesystem,
  terminal: evaluateTerminal,
  settings: evaluateSettings,
  diagnosis: evaluateDiagnosis,
  inspect: evaluateInspect,
};

export function evaluateStep(step: ChallengeStep, answer: StepAnswer): Evaluation {
  if (step.kind !== answer.kind) {
    return { correct: false, score: 0, mistakes: 0, messages: ['Resposta incompatível com a etapa.'] };
  }
  const evaluator = EVALUATORS[step.kind] as (s: ChallengeStep, a: StepAnswer) => Evaluation;
  return evaluator(step, answer);
}
