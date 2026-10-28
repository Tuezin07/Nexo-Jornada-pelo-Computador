/**
 * Catálogo sintético e utilitários para os testes de domínio, persistência e store.
 *
 * Os setores usam os IDs reais (o tipo `SectorId` e `getSector` exigem isso), mas as
 * regras de desbloqueio, as missões e as etapas são fictícias: os testes não dependem
 * do conteúdo real, que ainda está sendo escrito.
 */
import type {
  AssessmentQuestion,
  CategoryId,
  ChallengeStep,
  Difficulty,
  MissionDefinition,
  QuizStep,
  SectorDefinition,
  SectorId,
  SectorUnlockRule,
} from '../../src/content/types';
import type { ConceptId } from '../../src/content/concepts';
import { createCatalog, type Catalog } from '../../src/domain/catalog';
import {
  advance,
  revealStep,
  startRun,
  submitAnswer,
  summarizeRun,
  useHint as applyHint,
  type RunSummary,
} from '../../src/domain/engine';
import { createInitialState, emptyMissionRecord, type GameState, type MissionRecord } from '../../src/domain/state';

export const MINUTE = 60_000;
export const HOUR = 3_600_000;
export const DAY = 24 * HOUR;

/** 15/03/2026 às 12:00 no fuso local: longe da meia-noite, evita viradas de dia. */
export const T0 = new Date(2026, 2, 15, 12, 0, 0).getTime();

export function quizStep(id: string, concept: ConceptId = 'teclas-essenciais', extra: Partial<QuizStep> = {}): QuizStep {
  return {
    kind: 'quiz',
    id,
    title: `Etapa ${id}`,
    prompt: 'Qual é a resposta?',
    hint: 'Pense com calma.',
    explanation: 'Porque sim.',
    concept,
    options: [
      { id: 'a', text: 'Certa', correct: true, feedback: 'Isso mesmo.' },
      { id: 'b', text: 'Errada', feedback: 'Não é isso.' },
      { id: 'c', text: 'Outra errada', feedback: 'Também não.' },
    ],
    ...extra,
  };
}

export interface MissionSpec {
  id: string;
  sector?: SectorId;
  order?: number;
  category?: CategoryId;
  difficulty?: Difficulty;
  prerequisites?: string[];
  concepts?: ConceptId[];
  steps?: ChallengeStep[];
  stepCount?: number;
  version?: number;
  title?: string;
}

export function makeMission(spec: MissionSpec): MissionDefinition {
  const concepts = spec.concepts ?? ['teclas-essenciais'];
  const count = spec.stepCount ?? 3;
  const steps =
    spec.steps ?? Array.from({ length: count }, (_, i) => quizStep(`${spec.id}-${i + 1}`, concepts[i % concepts.length]!));
  return {
    id: spec.id,
    version: spec.version ?? 1,
    sector: spec.sector ?? 'fundamentos',
    order: spec.order ?? 1,
    title: spec.title ?? `Missão ${spec.id}`,
    summary: 'Missão sintética de teste.',
    briefing: 'Briefing de teste.',
    category: spec.category ?? 'teclado',
    subcategory: 'teste',
    difficulty: spec.difficulty ?? 1,
    estimatedMinutes: 5,
    prerequisites: spec.prerequisites ?? [],
    objectives: ['Objetivo de teste'],
    concepts,
    steps,
    debrief: 'Debrief de teste.',
  };
}

export function makeSector(id: SectorId, order: number, unlock: SectorUnlockRule[]): SectorDefinition {
  return {
    id,
    order,
    name: `Setor ${id}`,
    tagline: 'tagline',
    description: 'descrição',
    objectives: ['objetivo'],
    unlock,
    unlockHint: 'dica',
  };
}

/** Todos os cinco setores (as conquistas de setor esperam encontrá-los no catálogo). */
export const SYNTHETIC_SECTORS: SectorDefinition[] = [
  makeSector('fundamentos', 1, [{ type: 'always' }]),
  makeSector('sistema', 2, [
    { type: 'completedInSector', sector: 'fundamentos', count: 2 },
    { type: 'startingLevel', min: 'casual' },
    { type: 'assessmentScore', min: 0.6 },
  ]),
  makeSector('rede-segura', 3, [
    { type: 'completedInSector', sector: 'sistema', count: 1 },
    { type: 'startingLevel', min: 'veterano' },
    { type: 'assessmentScore', min: 0.8 },
  ]),
  makeSector('diagnostico', 4, [{ type: 'startingLevel', min: 'mestre' }]),
  makeSector('eficiencia', 5, [{ type: 'completedInSector', sector: 'diagnostico', count: 1 }]),
];

export const MISSION_A = makeMission({ id: 'f01-alfa', order: 1, category: 'teclado', concepts: ['teclas-essenciais'] });
export const MISSION_B = makeMission({
  id: 'f02-beta',
  order: 2,
  category: 'arquivos',
  prerequisites: ['f01-alfa'],
  concepts: ['arquivos-pastas'],
});
export const MISSION_C = makeMission({ id: 'f03-gama', order: 3, category: 'seguranca', difficulty: 2, concepts: ['senhas-fortes'] });
export const MISSION_S1 = makeMission({
  id: 's01-delta',
  sector: 'sistema',
  order: 1,
  category: 'configuracoes',
  difficulty: 2,
  concepts: ['configuracoes-tela'],
});
export const MISSION_R1 = makeMission({
  id: 'r01-epsilon',
  sector: 'rede-segura',
  order: 1,
  category: 'internet',
  difficulty: 3,
  concepts: ['url-anatomia'],
});

export const SYNTHETIC_MISSIONS = [MISSION_A, MISSION_B, MISSION_C, MISSION_S1, MISSION_R1];

export function syntheticCatalog(missions: MissionDefinition[] = SYNTHETIC_MISSIONS): Catalog {
  return createCatalog(missions, SYNTHETIC_SECTORS);
}

export function freshState(now = T0): GameState {
  return createInitialState(now);
}

/** Estado com registros de missão concluída (sem passar pelo redutor). */
export function withCompleted(state: GameState, ids: string[], at = T0): GameState {
  const missions: Record<string, MissionRecord> = { ...state.progress.missions };
  for (const id of ids) {
    missions[id] = { ...emptyMissionRecord(1), attempts: 1, completions: 1, bestAccuracy: 1, lastAccuracy: 1, firstCompletedAt: at, lastCompletedAt: at, lastAttemptAt: at };
  }
  return { ...state, progress: { ...state.progress, missions } };
}

export interface PlayOptions {
  /** Índices das etapas em que o jogador erra uma vez antes de acertar. */
  wrongFirst?: number[];
  /** Índices das etapas em que o jogador erra duas vezes e pede a solução. */
  reveal?: number[];
  /** Índices das etapas em que o jogador usa a pista. */
  hint?: number[];
}

/** Joga do início ao fim uma missão composta só de etapas de quiz (alternativa "a" é a certa). */
export function playQuizMission(
  mission: MissionDefinition,
  runId: string,
  startedAt: number,
  finishedAt = startedAt + 5 * MINUTE,
  options: PlayOptions = {},
): RunSummary {
  let run = startRun(mission, runId, startedAt);
  mission.steps.forEach((step, i) => {
    if (step.kind !== 'quiz') throw new Error('playQuizMission só aceita etapas de quiz');
    if (options.hint?.includes(i)) run = applyHint(run, step.id);
    if (options.reveal?.includes(i)) {
      run = submitAnswer(run, mission, step.id, { kind: 'quiz', selected: ['b'] }, startedAt).run;
      run = submitAnswer(run, mission, step.id, { kind: 'quiz', selected: ['c'] }, startedAt).run;
      run = revealStep(run, step.id, startedAt);
    } else {
      if (options.wrongFirst?.includes(i)) run = submitAnswer(run, mission, step.id, { kind: 'quiz', selected: ['b'] }, startedAt).run;
      run = submitAnswer(run, mission, step.id, { kind: 'quiz', selected: ['a'] }, startedAt).run;
    }
    run = advance(run, startedAt);
  });
  const summary = summarizeRun(run, mission, finishedAt);
  if (!summary) throw new Error('A execução não foi concluída.');
  return summary;
}

export function makeQuestion(id: string, category: CategoryId, difficulty: Difficulty, concept: ConceptId = 'teclas-essenciais'): AssessmentQuestion {
  return { id, category, difficulty, step: quizStep(`${id}-step`, concept) };
}
