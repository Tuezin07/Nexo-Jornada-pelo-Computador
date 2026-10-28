/**
 * Descrição textual da solução de cada etapa, exibida quando o jogador escolhe
 * "Ver solução" após errar. Texto com a marcação do RichText.
 */
import type { ChallengeStep } from '../../content/types';
import { expectedCombos, comboKeys, type Platform } from '../../domain/sim/keys';

export function describeSolution(step: ChallengeStep, platform: Platform): string[] {
  switch (step.kind) {
    case 'quiz': {
      const correct = step.options.filter((o) => o.correct);
      return correct.map((o) => `${step.multiple ? 'Correta' : 'Resposta'}: ${o.text}`);
    }
    case 'order':
      return step.items.map((item, i) => `${i + 1}. ${item.text}`);
    case 'classify':
      return step.items.map((item) => `${item.text} → **${step.buckets.find((b) => b.id === item.bucket)?.label ?? item.bucket}**`);
    case 'shortcut':
      return expectedCombos(step, platform).map((c) => `Pressione {{${comboKeys(c, platform).join('+')}}}`);
    case 'typing':
      return ['Nesta etapa não há resposta para revelar: o importante é a prática. Siga em frente e volte no Treino quando quiser.'];
    case 'filesystem':
    case 'terminal':
      return step.goals.map((g) => `Objetivo: ${g.label}`).concat(step.hint ? [`Dica: ${step.hint}`] : []);
    case 'settings':
      return step.goals.map((g) => `Ajuste: ${g.label}`);
    case 'diagnosis':
      return ['Siga sempre a ação mais segura e simples primeiro.'];
    case 'inspect':
      return [
        ...step.parts.filter((p) => p.suspicious).map((p) => `**${p.field}**: ${p.explanation}`),
        ...step.verdict.options.filter((o) => o.correct).map((o) => `Veredito: ${o.text}`),
      ];
  }
}
