/**
 * Registro de componentes por formato de etapa. Um novo formato precisa de um
 * avaliador em domain/evaluators.ts e de um componente aqui; o tipo `Registry`
 * obriga a cobrir todos os formatos.
 */
import type { ChallengeStep, StepKind } from '../../content/types';
import type { StepAnswer, Evaluation } from '../../domain/evaluators';
import type { Platform } from '../../domain/sim/keys';
import type { ChallengeComponent } from './types';
import { QuizChallenge } from './QuizChallenge';
import { OrderChallenge } from './OrderChallenge';
import { ClassifyChallenge } from './ClassifyChallenge';
import { ShortcutChallenge } from './ShortcutChallenge';
import { TypingChallenge } from './TypingChallenge';
import { FilesystemChallenge } from './FilesystemChallenge';
import { TerminalChallenge } from './TerminalChallenge';
import { SettingsChallenge } from './SettingsChallenge';
import { DiagnosisChallenge } from './DiagnosisChallenge';
import { InspectChallenge } from './InspectChallenge';
import './challenges.css';

type Registry = { [K in StepKind]: ChallengeComponent<K> };

export const CHALLENGES: Registry = {
  quiz: QuizChallenge,
  order: OrderChallenge,
  classify: ClassifyChallenge,
  shortcut: ShortcutChallenge,
  typing: TypingChallenge,
  filesystem: FilesystemChallenge,
  terminal: TerminalChallenge,
  settings: SettingsChallenge,
  diagnosis: DiagnosisChallenge,
  inspect: InspectChallenge,
};

export const KIND_LABEL: Record<StepKind, string> = {
  quiz: 'Escolha',
  order: 'Ordenação',
  classify: 'Classificação',
  shortcut: 'Atalho',
  typing: 'Digitação',
  filesystem: 'Explorador',
  terminal: 'Terminal',
  settings: 'Configurações',
  diagnosis: 'Diagnóstico',
  inspect: 'Inspeção',
};

interface RenderProps {
  step: ChallengeStep;
  locked: boolean;
  revealed: boolean;
  submit: (answer: StepAnswer) => Evaluation;
  platform: Platform;
  preferVirtualKeyboard: boolean;
}

/** Renderiza o componente certo para a etapa. `key` reinicia o estado ao trocar de etapa. */
export function ChallengeView({ step, ...rest }: RenderProps) {
  const Component = CHALLENGES[step.kind] as unknown as (props: RenderProps) => React.JSX.Element;
  return <Component key={step.id} step={step} {...rest} />;
}
