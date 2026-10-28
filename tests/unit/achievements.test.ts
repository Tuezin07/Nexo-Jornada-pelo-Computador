import { describe, expect, it } from 'vitest';
import {
  ACHIEVEMENTS,
  buildAchievementContext,
  getAchievement,
  newlyEarned,
  unlockedTitles,
} from '../../src/domain/achievements';
import { dayKey, type GameState } from '../../src/domain/state';
import { totalXpForLevel } from '../../src/domain/xp';
import { DAY, HOUR, T0, freshState, syntheticCatalog, withCompleted } from '../helpers/fixtures';

const catalog = syntheticCatalog();
const earnedIds = (state: GameState, now = T0) => newlyEarned(state, catalog, now).map((a) => a.id);
const withStats = (state: GameState, patch: Partial<GameState['progress']['stats']>): GameState => ({
  ...state,
  progress: { ...state.progress, stats: { ...state.progress.stats, ...patch } },
});
const register = (state: GameState, ids: string[], at = T0): GameState => ({
  ...state,
  progress: { ...state.progress, achievements: { ...state.progress.achievements, ...Object.fromEntries(ids.map((id) => [id, at])) } },
});

describe('definições', () => {
  it('ids únicos e busca por id', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(getAchievement('primeiro-passo')?.name).toBe('Primeiro passo');
    expect(getAchievement('nao-existe')).toBeUndefined();
  });
});

describe('newlyEarned', () => {
  it('jogador novo não ganha nada', () => {
    expect(earnedIds(freshState())).toEqual([]);
  });

  it('primeira missão concluída → "primeiro-passo"', () => {
    expect(earnedIds(withCompleted(freshState(), ['f01-alfa']))).toEqual(['primeiro-passo']);
  });

  it('não repete conquista já registrada', () => {
    const state = register(withCompleted(freshState(), ['f01-alfa']), ['primeiro-passo']);
    expect(earnedIds(state)).toEqual([]);
  });

  it('missões sem erros: "sem-arranhoes" com 1 e "mao-firme" com 5', () => {
    expect(earnedIds(withStats(freshState(), { flawlessRuns: 1 }))).toEqual(['sem-arranhoes']);
    expect(earnedIds(withStats(freshState(), { flawlessRuns: 4 }))).not.toContain('mao-firme');
    expect(earnedIds(withStats(freshState(), { flawlessRuns: 5 }))).toEqual(['sem-arranhoes', 'mao-firme']);
  });

  it('nível 5 pelo XP', () => {
    const at = (xp: number) => earnedIds({ ...freshState(), progress: { ...freshState().progress, xp } });
    expect(at(totalXpForLevel(5) - 1)).not.toContain('nivel-5');
    expect(at(totalXpForLevel(5))).toContain('nivel-5');
    expect(at(totalXpForLevel(10))).toEqual(expect.arrayContaining(['nivel-5', 'nivel-10']));
  });

  it('avaliação respondida (não pulada) → "calibrado"', () => {
    const base = freshState();
    const answered = { ...base, profile: { ...base.profile, assessment: { completedAt: T0, skipped: false, score: 0.2, perCategory: {}, questionIds: [] } } };
    const skipped = { ...base, profile: { ...base.profile, assessment: { completedAt: T0, skipped: true, score: 0, perCategory: {}, questionIds: [] } } };
    expect(earnedIds(answered)).toEqual(['calibrado']);
    expect(earnedIds(skipped)).toEqual([]);
  });

  it('dias seguidos: 3 → "ritmo"; 7 → "constancia"', () => {
    const days = (n: number) => Array.from({ length: n }, (_, i) => dayKey(T0 - i * DAY));
    const state = (n: number) => ({ ...freshState(), progress: { ...freshState().progress, activeDays: days(n) } });
    expect(earnedIds(state(2))).toEqual([]);
    expect(earnedIds(state(3))).toEqual(['ritmo']);
    expect(earnedIds(state(7))).toEqual(['ritmo', 'constancia']);
  });

  it('formatos de etapa e Codex', () => {
    expect(earnedIds(withStats(freshState(), { stepKindsCorrect: { terminal: 3 } }))).toEqual(['linha-de-comando']);
    expect(earnedIds(withStats(freshState(), { stepKindsCorrect: { shortcut: 9 } }))).toEqual([]);
    const codex = { ...freshState(), progress: { ...freshState().progress, codexViewed: Array.from({ length: 10 }, (_, i) => `c${i}`) } };
    expect(earnedIds(codex)).toEqual(['curiosidade']);
  });

  it('setor completo só quando todas as missões do setor foram concluídas', () => {
    expect(earnedIds(withCompleted(freshState(), ['f01-alfa', 'f02-beta']))).not.toContain('setor-fundamentos');
    expect(earnedIds(withCompleted(freshState(), ['f01-alfa', 'f02-beta', 'f03-gama']))).toContain('setor-fundamentos');
  });

  it('setor sem missões no catálogo nunca conta como concluído', () => {
    const ctx = buildAchievementContext(freshState(), catalog, T0);
    expect(ctx.sectors.diagnostico).toEqual({ done: 0, total: 0 });
    expect(getAchievement('setor-diagnostico')!.check(ctx)).toBe(false);
  });

  it('conceito dominado → "primeiro-dominio"', () => {
    const state = freshState();
    state.progress.concepts.phishing = [0, 1, 24].map((h) => ({ at: T0 + h * HOUR, correct: true, firstTry: true, source: 'missao' as const }));
    expect(earnedIds(state, T0 + 25 * HOUR)).toEqual(['primeiro-dominio']);
  });

  it('progresso informado para conquistas de contador', () => {
    const ctx = buildAchievementContext(withStats(freshState(), { flawlessRuns: 2 }), catalog, T0);
    expect(getAchievement('mao-firme')!.progress!(ctx)).toEqual({ current: 2, target: 5 });
  });
});

describe('títulos', () => {
  it('só os títulos de conquistas registradas', () => {
    expect(unlockedTitles(freshState())).toEqual([]);
    expect(unlockedTitles(register(freshState(), ['mao-firme', 'primeiro-passo', 'linha-de-comando']))).toEqual(['Mão Firme', 'Root em Treinamento']);
  });
});
