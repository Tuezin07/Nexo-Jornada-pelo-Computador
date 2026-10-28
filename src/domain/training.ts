/**
 * Montagem de sessões de treino a partir do conteúdo existente (sem gerar perguntas
 * novas). Cada sessão vira uma "missão sintética" executada pelo mesmo motor.
 */
import type { CategoryId, ChallengeStep, MissionDefinition, TypingStep } from '../content/types';
import type { ConceptId } from '../content/concepts';
import type { Catalog } from './catalog';
import { conceptMastery } from './mastery';
import type { GameState } from './state';
import { completedMissionIds } from './state';
import { unlockedSectors } from './unlock';

export type TrainingMode = 'digitacao' | 'atalhos' | 'revisao' | 'inteligente';

export const TRAINING_SESSION_SIZE = 6;

export interface TrainingStepSource {
  step: ChallengeStep;
  missionId: string;
  category: CategoryId;
}

const REVIEW_KINDS = new Set<ChallengeStep['kind']>(['quiz', 'order', 'classify', 'inspect', 'shortcut']);

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** Etapas de missões em setores abertos; prioriza missões já concluídas. */
function availableSources(state: GameState, catalog: Catalog): TrainingStepSource[] {
  const open = unlockedSectors(state, catalog);
  return catalog.missions
    .filter((m) => open.has(m.sector))
    .flatMap((m) => m.steps.map((step) => ({ step, missionId: m.id, category: m.category })));
}

export function buildTrainingSteps(
  mode: TrainingMode,
  state: GameState,
  catalog: Catalog,
  random: () => number,
  now: number,
  options: { category?: CategoryId | null; extraTexts?: { id: string; text: string }[] } = {},
): TrainingStepSource[] {
  const sources = availableSources(state, catalog);
  const done = completedMissionIds(state);
  const preferDone = (list: TrainingStepSource[]) => {
    const fromDone = list.filter((s) => done.has(s.missionId));
    return fromDone.length >= 3 ? fromDone : list;
  };

  switch (mode) {
    case 'digitacao': {
      const fromMissions = sources.filter((s): s is TrainingStepSource & { step: TypingStep } => s.step.kind === 'typing');
      const extras: TrainingStepSource[] = (options.extraTexts ?? []).map((t) => ({
        missionId: 'treino',
        category: 'teclado',
        step: {
          id: t.id,
          kind: 'typing',
          title: 'Digitação livre',
          prompt: 'Digite o texto abaixo com calma. Precisão antes de velocidade.',
          hint: 'Mantenha os dedos na fileira base e olhe para a tela, não para o teclado.',
          explanation: 'Treinar textos variados ajuda a criar memória muscular para palavras comuns.',
          concept: 'digitacao-precisao',
          text: t.text,
          minAccuracy: 0.9,
        },
      }));
      return shuffle([...fromMissions, ...extras], random).slice(0, 1);
    }
    case 'atalhos':
      return shuffle(preferDone(sources.filter((s) => s.step.kind === 'shortcut')), random).slice(0, TRAINING_SESSION_SIZE);
    case 'revisao': {
      const pool = sources.filter((s) => REVIEW_KINDS.has(s.step.kind) && s.step.kind !== 'shortcut' && (!options.category || s.category === options.category));
      return shuffle(preferDone(pool), random).slice(0, TRAINING_SESSION_SIZE);
    }
    case 'inteligente': {
      const pool = sources.filter((s) => REVIEW_KINDS.has(s.step.kind));
      const weight = (concept: ConceptId) => {
        const m = conceptMastery(state, concept, now);
        if (m.struggling) return 3;
        if (m.reviewDue) return 2;
        if (m.state === 'aprendendo') return 1;
        return 0;
      };
      const ranked = shuffle(pool, random)
        .map((s) => ({ s, w: weight(s.step.concept) }))
        .filter((x) => x.w > 0)
        .sort((a, b) => b.w - a.w)
        .map((x) => x.s);
      // Um conceito por vez para variar o conteúdo da sessão.
      const seen = new Set<string>();
      const picked = ranked.filter((s) => (seen.has(s.step.concept) ? false : (seen.add(s.step.concept), true)));
      return (picked.length > 0 ? picked : shuffle(preferDone(pool), random)).slice(0, TRAINING_SESSION_SIZE);
    }
  }
}

/** Missão sintética que permite reaproveitar o motor de execução. */
export function trainingMission(mode: TrainingMode, sources: TrainingStepSource[]): MissionDefinition {
  const steps = sources.map((s) => ({ ...s.step, id: `${s.missionId}__${s.step.id}` }) as ChallengeStep);
  return {
    id: `treino-${mode}`,
    version: 1,
    sector: 'fundamentos',
    order: 0,
    title: 'Treino',
    summary: '',
    briefing: '',
    category: sources[0]?.category ?? 'teclado',
    subcategory: 'treino',
    difficulty: 1,
    estimatedMinutes: 5,
    prerequisites: [],
    objectives: [],
    concepts: [...new Set(steps.map((s) => s.concept))],
    steps,
    debrief: '',
  };
}
