import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../src/content/missions';
import { FUNDAMENTOS_MISSIONS } from '../src/content/missions/fundamentos';
import { SISTEMA_MISSIONS } from '../src/content/missions/sistema';
import { REDE_SEGURA_MISSIONS } from '../src/content/missions/rede-segura';
import { DIAGNOSTICO_MISSIONS } from '../src/content/missions/diagnostico';
import { EFICIENCIA_MISSIONS } from '../src/content/missions/eficiencia';
import { CODEX } from '../src/content/codex';
import { ASSESSMENT_QUESTIONS } from '../src/content/assessment';
import { CATEGORY_IDS } from '../src/content/categories';
import { SECTORS } from '../src/content/sectors';
import { validateAssessment, validateCodex, validateMissions } from '../src/content/validate';
import { seededShuffle } from '../src/ui/lib/shuffle';

const format = (issues: { where: string; message: string }[]) =>
  issues.map((i) => `${i.where}: ${i.message}`).join('\n');

describe('conteúdo das missões', () => {
  it.each([
    ['fundamentos', FUNDAMENTOS_MISSIONS],
    ['sistema', SISTEMA_MISSIONS],
    ['rede-segura', REDE_SEGURA_MISSIONS],
    ['diagnostico', DIAGNOSTICO_MISSIONS],
    ['eficiencia', EFICIENCIA_MISSIONS],
  ] as const)('setor %s é válido e consistente', (sector, missions) => {
    expect(missions.length).toBeGreaterThan(0);
    for (const m of missions) expect(m.sector).toBe(sector);
    // Prerequisites must be in the same sector, so each sector validates on its own.
    expect(format(validateMissions(missions))).toBe('');
    expect(missions.some((m) => m.prerequisites.length === 0)).toBe(true);
  });

  it('o conjunto completo é válido', () => {
    expect(format(validateMissions(MISSIONS))).toBe('');
  });

  it('tem pelo menos 30 missões', () => {
    expect(MISSIONS.length).toBeGreaterThanOrEqual(30);
  });

  it('usa vários formatos de desafio', () => {
    const kinds = new Set(MISSIONS.flatMap((m) => m.steps.map((s) => s.kind)));
    expect(kinds.size).toBeGreaterThanOrEqual(8);
  });

  it('todas as categorias têm conteúdo', () => {
    const used = new Set(MISSIONS.map((m) => m.category));
    for (const id of CATEGORY_IDS) {
      const inSteps = MISSIONS.some((m) => m.category === id);
      expect(inSteps || used.has(id), `categoria ${id} sem missões`).toBe(true);
    }
  });

  it('a posição exibida da alternativa correta não segue um padrão', () => {
    // A interface embaralha as alternativas por etapa (QuizChallenge); a posição
    // final da correta não pode ficar concentrada em uma letra.
    const counts = new Map<number, number>();
    let total = 0;
    for (const m of MISSIONS) {
      for (const s of m.steps) {
        if (s.kind !== 'quiz' || s.multiple) continue;
        const index = seededShuffle(s.options, s.id).findIndex((o) => o.correct);
        counts.set(index, (counts.get(index) ?? 0) + 1);
        total++;
      }
    }
    for (const [, n] of counts) expect(n / total).toBeLessThan(0.45);
  });

  it('cada setor tem uma porta de entrada', () => {
    for (const sector of SECTORS) {
      const entry = MISSIONS.filter((m) => m.sector === sector.id && m.prerequisites.length === 0);
      expect(entry.length, sector.id).toBeGreaterThan(0);
    }
  });
});

describe('Codex', () => {
  it('cobre todos os conceitos com entradas completas', () => {
    expect(format(validateCodex(CODEX))).toBe('');
  });
});

describe('avaliação inicial', () => {
  it('tem um banco válido cobrindo as categorias', () => {
    expect(format(validateAssessment(ASSESSMENT_QUESTIONS))).toBe('');
    expect(ASSESSMENT_QUESTIONS.length).toBeGreaterThanOrEqual(13);
    const categories = new Set(ASSESSMENT_QUESTIONS.map((q) => q.category));
    for (const id of CATEGORY_IDS) expect(categories.has(id), id).toBe(true);
  });
});
