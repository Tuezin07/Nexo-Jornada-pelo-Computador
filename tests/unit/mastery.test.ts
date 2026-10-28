import { describe, expect, it } from 'vitest';
import { CONCEPT_IDS } from '../../src/content/concepts';
import { REVIEW_GAP_HOURS, STALE_DAYS, conceptMastery, masteryOf, masterySummary } from '../../src/domain/mastery';
import type { ConceptEvidence } from '../../src/domain/state';
import { DAY, HOUR, T0, freshState } from '../helpers/fixtures';

const ev = (at: number, correct = true, firstTry = true): ConceptEvidence => ({ at, correct, firstTry, source: 'missao' });

describe('estados de domínio', () => {
  it('sem evidência: não estudado', () => {
    expect(masteryOf(undefined, T0)).toEqual({
      state: 'nao-estudado',
      correct: 0,
      total: 0,
      recentAccuracy: 0,
      struggling: false,
      reviewDue: false,
      lastAt: null,
    });
    expect(masteryOf([], T0).state).toBe('nao-estudado');
  });

  it('um único acerto NÃO é domínio: aprendendo', () => {
    const info = masteryOf([ev(T0)], T0 + 30 * DAY);
    expect(info.state).toBe('aprendendo');
    expect(info.correct).toBe(1);
    expect(info.struggling).toBe(false);
  });

  it('um erro: aprendendo e com dificuldade', () => {
    const info = masteryOf([ev(T0, false)], T0);
    expect(info.state).toBe('aprendendo');
    expect(info.struggling).toBe(true);
  });

  it('dois acertos: praticado', () => {
    expect(masteryOf([ev(T0), ev(T0 + HOUR)], T0 + HOUR).state).toBe('praticado');
  });

  it('três acertos de primeira na mesma sessão: praticado, ainda não dominado', () => {
    expect(masteryOf([ev(T0), ev(T0), ev(T0 + 10 * 60_000)], T0 + HOUR).state).toBe('praticado');
  });

  it(`dominado exige revisão ≥ ${REVIEW_GAP_HOURS} h depois`, () => {
    const early = [ev(T0), ev(T0 + HOUR), ev(T0 + 19.9 * HOUR)];
    expect(masteryOf(early, T0 + 20 * HOUR).state).toBe('praticado');
    const spaced = [ev(T0), ev(T0 + HOUR), ev(T0 + REVIEW_GAP_HOURS * HOUR)];
    expect(masteryOf(spaced, T0 + 21 * HOUR).state).toBe('dominado');
  });

  it('dominado exige pelo menos 2 acertos de primeira', () => {
    const list = [ev(T0, true, false), ev(T0 + HOUR, true, false), ev(T0 + 24 * HOUR, true, true)];
    expect(masteryOf(list, T0 + 25 * HOUR).state).toBe('praticado');
  });

  it('dominado exige que a evidência mais recente seja correta', () => {
    const list = [ev(T0), ev(T0 + HOUR), ev(T0 + 24 * HOUR), ev(T0 + 25 * HOUR, false)];
    const info = masteryOf(list, T0 + 26 * HOUR);
    expect(info.state).not.toBe('dominado');
    expect(info.struggling).toBe(true);
  });

  it('dominado exige precisão recente ≥ 80% (últimas 5)', () => {
    const list = [ev(T0, false), ev(T0 + HOUR), ev(T0 + 2 * HOUR, false), ev(T0 + 3 * HOUR), ev(T0 + 24 * HOUR)];
    const info = masteryOf(list, T0 + 25 * HOUR);
    expect(info.recentAccuracy).toBeCloseTo(0.6);
    expect(info.state).toBe('praticado');
  });

  it('precisão recente considera só as 5 últimas evidências', () => {
    const old = [ev(T0, false), ev(T0 + 1, false), ev(T0 + 2, false)];
    const recent = [1, 2, 3, 4, 5].map((i) => ev(T0 + i * 6 * HOUR));
    const info = masteryOf([...old, ...recent], T0 + 40 * HOUR);
    expect(info.recentAccuracy).toBe(1);
    expect(info.total).toBe(8);
    expect(info.state).toBe('dominado');
  });

  it('a ordem de entrada não importa', () => {
    const list = [ev(T0 + 24 * HOUR), ev(T0), ev(T0 + HOUR)];
    expect(masteryOf(list, T0 + 25 * HOUR).state).toBe('dominado');
    expect(masteryOf(list, T0 + 25 * HOUR).lastAt).toBe(T0 + 24 * HOUR);
  });

  it('tempo de execução não entra: só data, acerto e primeira tentativa', () => {
    // mesmas evidências avaliadas em momentos diferentes têm o mesmo estado
    const list = [ev(T0), ev(T0 + HOUR), ev(T0 + 24 * HOUR)];
    expect(masteryOf(list, T0 + 25 * HOUR).state).toBe(masteryOf(list, T0 + 10 * DAY).state);
  });
});

describe('dificuldade (struggling)', () => {
  it('precisão recente < 60% mesmo com o último acerto', () => {
    const info = masteryOf([ev(T0, false), ev(T0 + 1, false), ev(T0 + 2, false), ev(T0 + 3)], T0 + HOUR);
    expect(info.recentAccuracy).toBe(0.25);
    expect(info.struggling).toBe(true);
    expect(info.state).toBe('aprendendo');
  });

  it('último erro marca dificuldade mesmo com histórico bom', () => {
    const info = masteryOf([ev(T0), ev(T0 + 1), ev(T0 + 2), ev(T0 + 3), ev(T0 + 4, false)], T0 + HOUR);
    expect(info.recentAccuracy).toBe(0.8);
    expect(info.struggling).toBe(true);
    expect(info.reviewDue).toBe(false);
  });
});

describe('revisão pendente (reviewDue)', () => {
  const practiced = [ev(T0), ev(T0 + HOUR)];

  it(`praticado: revisão depois de ${REVIEW_GAP_HOURS} h do último acerto`, () => {
    expect(masteryOf(practiced, T0 + HOUR + 19 * HOUR).reviewDue).toBe(false);
    expect(masteryOf(practiced, T0 + HOUR + 20 * HOUR).reviewDue).toBe(true);
  });

  it(`dominado: revisão só depois de ${STALE_DAYS} dias`, () => {
    const mastered = [ev(T0), ev(T0 + HOUR), ev(T0 + 24 * HOUR)];
    expect(masteryOf(mastered, T0 + 24 * HOUR + 2 * DAY).reviewDue).toBe(false);
    expect(masteryOf(mastered, T0 + 24 * HOUR + STALE_DAYS * DAY).reviewDue).toBe(true);
  });

  it('aprendendo não tem revisão pendente; quem está com dificuldade também não', () => {
    expect(masteryOf([ev(T0)], T0 + 10 * DAY).reviewDue).toBe(false);
    expect(masteryOf([ev(T0), ev(T0 + 1), ev(T0 + 2, false)], T0 + 10 * DAY).reviewDue).toBe(false);
  });
});

describe('a partir do estado do jogo', () => {
  it('conceptMastery e masterySummary', () => {
    const state = freshState();
    state.progress.concepts['teclas-essenciais'] = [ev(T0), ev(T0 + HOUR), ev(T0 + 24 * HOUR)];
    state.progress.concepts['mouse-acoes'] = [ev(T0)];
    state.progress.concepts.lixeira = [ev(T0), ev(T0 + 1)];
    const now = T0 + 25 * HOUR;
    expect(conceptMastery(state, 'teclas-essenciais', now).state).toBe('dominado');
    expect(conceptMastery(state, 'phishing', now).state).toBe('nao-estudado');
    const summary = masterySummary(state, CONCEPT_IDS, now);
    expect(summary).toEqual({ 'nao-estudado': CONCEPT_IDS.length - 3, aprendendo: 1, praticado: 1, dominado: 1 });
  });
});
