/**
 * Contrato dos componentes de desafio.
 *
 * Cada formato de etapa tem um componente que recebe a definição da etapa e envia
 * respostas para o motor por `submit`. O componente NUNCA decide sozinho se a etapa
 * está correta: ele usa a avaliação devolvida por `submit` apenas para dar retorno
 * visual (ex.: marcar a alternativa errada). Pistas, explicação, "ver solução" e o
 * botão de continuar ficam no quadro da etapa (StepFrame), fora do componente.
 */
import type { StepKind, StepOfKind } from '../../content/types';
import type { AnswerOfKind, Evaluation } from '../../domain/evaluators';
import type { Platform } from '../../domain/sim/keys';

export interface ChallengeProps<K extends StepKind> {
  step: StepOfKind<K>;
  /** A etapa foi concluída (acerto ou solução revelada): bloqueie a interação. */
  locked: boolean;
  /** O jogador pediu para ver a solução: mostre a resposta certa, se fizer sentido. */
  revealed: boolean;
  /** Avalia a resposta pelo motor do jogo e devolve o resultado imediatamente. */
  submit: (answer: AnswerOfKind<K>) => Evaluation;
  platform: Platform;
  /** Preferência do jogador por teclado virtual (telas de toque). */
  preferVirtualKeyboard: boolean;
}

export type ChallengeComponent<K extends StepKind> = (props: ChallengeProps<K>) => React.JSX.Element;
