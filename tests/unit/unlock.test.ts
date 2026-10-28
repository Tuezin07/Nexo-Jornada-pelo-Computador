import { describe, expect, it } from 'vitest';
import type { StartingLevel } from '../../src/content/types';
import type { GameState } from '../../src/domain/state';
import {
  isPlayable,
  isSectorUnlocked,
  missingPrerequisites,
  missionStatus,
  ruleSatisfied,
  sectorProgress,
  unlockedSectors,
} from '../../src/domain/unlock';
import {
  MISSION_A,
  MISSION_B,
  MISSION_C,
  MISSION_R1,
  MISSION_S1,
  SYNTHETIC_SECTORS,
  T0,
  freshState,
  syntheticCatalog,
  withCompleted,
} from '../helpers/fixtures';

const catalog = syntheticCatalog();
const sector = (id: string) => SYNTHETIC_SECTORS.find((s) => s.id === id)!;
const withLevel = (state: GameState, level: StartingLevel | null): GameState => ({ ...state, profile: { ...state.profile, startingLevel: level } });
const withAssessment = (state: GameState, score: number, skipped = false): GameState => ({
  ...state,
  profile: { ...state.profile, assessment: { completedAt: T0, skipped, score, perCategory: {}, questionIds: [] } },
});
const open = (state: GameState) => [...unlockedSectors(state, catalog)].sort();

describe('setores', () => {
  it('jogador novo: só o setor sempre aberto', () => {
    expect(open(freshState())).toEqual(['fundamentos']);
  });

  it('abre por regra de progresso (missões concluídas no setor indicado)', () => {
    const one = withCompleted(freshState(), ['f01-alfa']);
    expect(isSectorUnlocked(sector('sistema'), one, catalog)).toBe(false);
    const two = withCompleted(freshState(), ['f01-alfa', 'f03-gama']);
    expect(isSectorUnlocked(sector('sistema'), two, catalog)).toBe(true);
    expect(sectorProgress('fundamentos', two, catalog)).toEqual({ done: 2, total: 3 });
  });

  it('só contam missões do setor indicado que existem no catálogo e foram concluídas', () => {
    let state = withCompleted(freshState(), ['f01-alfa', 's01-delta', 'missao-que-nao-existe']);
    expect(isSectorUnlocked(sector('sistema'), state, catalog)).toBe(false);
    // tentativa sem conclusão não conta
    state = { ...state, progress: { ...state.progress, missions: { ...state.progress.missions, 'f02-beta': { ...state.progress.missions['f01-alfa']!, completions: 0 } } } };
    expect(isSectorUnlocked(sector('sistema'), state, catalog)).toBe(false);
  });

  it('abre por nível declarado', () => {
    expect(open(withLevel(freshState(), 'iniciante'))).toEqual(['fundamentos']);
    expect(open(withLevel(freshState(), 'casual'))).toEqual(['fundamentos', 'sistema']);
    expect(open(withLevel(freshState(), 'veterano'))).toEqual(['fundamentos', 'rede-segura', 'sistema']);
    expect(open(withLevel(freshState(), 'mestre'))).toEqual(['diagnostico', 'fundamentos', 'rede-segura', 'sistema']);
  });

  it('abre pela avaliação (não pulada) com a nota mínima', () => {
    expect(isSectorUnlocked(sector('sistema'), withAssessment(freshState(), 0.59), catalog)).toBe(false);
    expect(isSectorUnlocked(sector('sistema'), withAssessment(freshState(), 0.6), catalog)).toBe(true);
    expect(isSectorUnlocked(sector('rede-segura'), withAssessment(freshState(), 0.8), catalog)).toBe(true);
    expect(isSectorUnlocked(sector('sistema'), withAssessment(freshState(), 1, true), catalog)).toBe(false);
  });

  it('nível declarado nunca bloqueia: progresso abre o setor para qualquer nível', () => {
    for (const level of ['iniciante', 'casual', 'veterano', 'mestre', null] as const) {
      const state = withCompleted(withLevel(freshState(), level), ['f01-alfa', 'f02-beta']);
      expect(isSectorUnlocked(sector('fundamentos'), state, catalog)).toBe(true);
      expect(isSectorUnlocked(sector('sistema'), state, catalog)).toBe(true);
    }
  });

  it('nível alto não fecha o que já estava aberto nem trava missões concluídas', () => {
    const state = withCompleted(withLevel(freshState(), 'mestre'), ['f01-alfa']);
    expect(missionStatus(MISSION_A, state, catalog)).toBe('concluida');
    expect(missionStatus(MISSION_B, state, catalog)).toBe('disponivel');
  });

  it('desbloqueios em cadeia por progresso', () => {
    const state = withCompleted(freshState(), ['f01-alfa', 'f02-beta', 's01-delta']);
    expect(open(state)).toEqual(['fundamentos', 'rede-segura', 'sistema']);
  });

  it('ruleSatisfied: always', () => {
    expect(ruleSatisfied({ type: 'always' }, freshState(), catalog)).toBe(true);
    expect(ruleSatisfied({ type: 'startingLevel', min: 'iniciante' }, freshState(), catalog)).toBe(false); // sem onboarding
  });
});

describe('missões', () => {
  it('bloqueada por requisito até concluir o pré-requisito', () => {
    const state = freshState();
    expect(missionStatus(MISSION_B, state, catalog)).toBe('bloqueada-requisito');
    expect(missingPrerequisites(MISSION_B, state, catalog).map((m) => m.id)).toEqual(['f01-alfa']);
    expect(isPlayable(MISSION_B, state, catalog)).toBe(false);

    const after = withCompleted(state, ['f01-alfa']);
    expect(missionStatus(MISSION_B, after, catalog)).toBe('disponivel');
    expect(missingPrerequisites(MISSION_B, after, catalog)).toEqual([]);
    expect(isPlayable(MISSION_B, after, catalog)).toBe(true);
  });

  it('bloqueada pelo setor', () => {
    expect(missionStatus(MISSION_S1, freshState(), catalog)).toBe('bloqueada-setor');
    expect(missionStatus(MISSION_R1, withLevel(freshState(), 'casual'), catalog)).toBe('bloqueada-setor');
    expect(missionStatus(MISSION_S1, withLevel(freshState(), 'casual'), catalog)).toBe('disponivel');
  });

  it('sem requisitos e com setor aberto: disponível; concluída continua jogável (revisão)', () => {
    expect(missionStatus(MISSION_C, freshState(), catalog)).toBe('disponivel');
    const done = withCompleted(freshState(), ['f03-gama']);
    expect(missionStatus(MISSION_C, done, catalog)).toBe('concluida');
    expect(isPlayable(MISSION_C, done, catalog)).toBe(true);
  });
});
