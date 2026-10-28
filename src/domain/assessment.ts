/**
 * Avaliação inicial: seleção determinística de perguntas e cálculo do resultado.
 * O resultado é ponto de partida, não rótulo: ele ajusta a dificuldade-alvo e pode
 * abrir setores mais cedo, mas nunca bloqueia conteúdo.
 */
import type { AssessmentQuestion, CategoryId, Difficulty, StartingLevel } from '../content/types';
import { CATEGORY_IDS } from '../content/categories';
import type { AssessmentRecord } from './state';

export const ASSESSMENT_LENGTH = 6;
const MAX_FOCUS_QUESTIONS = 4;

const PLAN: Record<StartingLevel, Difficulty[]> = {
  iniciante: [1, 1, 1, 2, 2, 2],
  casual: [1, 1, 2, 2, 2, 3],
  veterano: [1, 2, 2, 3, 3, 3],
  mestre: [2, 2, 3, 3, 3, 3],
};

export function selectAssessmentQuestions(
  pool: AssessmentQuestion[],
  level: StartingLevel,
  focusAreas: CategoryId[],
  count = ASSESSMENT_LENGTH,
): AssessmentQuestion[] {
  const plan = PLAN[level];
  const levelIndex = ['iniciante', 'casual', 'veterano', 'mestre'].indexOf(level);
  const focus = CATEGORY_IDS.filter((c) => focusAreas.includes(c)).slice(0, MAX_FOCUS_QUESTIONS);
  const rotated = CATEGORY_IDS.filter((c) => !focus.includes(c));
  const offset = (levelIndex * 3) % Math.max(1, rotated.length);
  const order = [...focus, ...rotated.slice(offset), ...rotated.slice(0, offset)];

  const used = new Set<string>();
  const usedCategories = new Set<CategoryId>();
  const picks: AssessmentQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const desired = plan[Math.min(i, plan.length - 1)]!;
    for (const category of order) {
      if (usedCategories.has(category)) continue;
      const candidates = pool
        .filter((q) => q.category === category && !used.has(q.id))
        .sort((a, b) => Math.abs(a.difficulty - desired) - Math.abs(b.difficulty - desired) || a.id.localeCompare(b.id));
      const choice = candidates[0];
      if (!choice) continue;
      picks.push(choice);
      used.add(choice.id);
      usedCategories.add(category);
      break;
    }
  }
  for (const q of [...pool].sort((a, b) => a.id.localeCompare(b.id))) {
    if (picks.length >= count) break;
    if (!used.has(q.id)) {
      picks.push(q);
      used.add(q.id);
    }
  }
  return picks.sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id));
}

export function isAnswerCorrect(question: AssessmentQuestion, optionId: string | undefined): boolean {
  return Boolean(question.step.options.find((o) => o.id === optionId)?.correct);
}

/** Pontuação ponderada pela dificuldade (0..1) e acertos por categoria. */
export function scoreAssessment(
  questions: AssessmentQuestion[],
  answers: Record<string, string>,
  now: number,
): AssessmentRecord {
  let weighted = 0;
  let total = 0;
  const perCategory: AssessmentRecord['perCategory'] = {};
  for (const q of questions) {
    const correct = isAnswerCorrect(q, answers[q.id]);
    weighted += correct ? q.difficulty : 0;
    total += q.difficulty;
    const entry = perCategory[q.category] ?? { correct: 0, total: 0 };
    entry.total += 1;
    entry.correct += correct ? 1 : 0;
    perCategory[q.category] = entry;
  }
  return {
    completedAt: now,
    skipped: false,
    score: total > 0 ? Math.round((weighted / total) * 1000) / 1000 : 0,
    perCategory,
    questionIds: questions.map((q) => q.id),
  };
}

export function skippedAssessment(now: number): AssessmentRecord {
  return { completedAt: now, skipped: true, score: 0, perCategory: {}, questionIds: [] };
}

export function assessmentVerdict(record: AssessmentRecord, declared: StartingLevel): string {
  if (record.skipped) return 'Avaliação pulada. As recomendações vão se ajustar conforme você joga.';
  const pct = Math.round(record.score * 100);
  if (record.score >= 0.75 && (declared === 'iniciante' || declared === 'casual')) {
    return `Você acertou ${pct}% (ponderado pela dificuldade): mais do que o nível que declarou. Setores adicionais podem abrir mais cedo.`;
  }
  if (record.score < 0.4 && (declared === 'veterano' || declared === 'mestre')) {
    return `Você acertou ${pct}%. Vamos começar por missões que consolidam a base antes dos desafios avançados; nada fica bloqueado por isso.`;
  }
  return `Você acertou ${pct}% (ponderado pela dificuldade). As primeiras missões foram escolhidas a partir disso.`;
}
