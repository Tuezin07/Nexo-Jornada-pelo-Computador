import { describe, expect, it } from 'vitest';
import { MAX_ATTEMPTS, MAX_EVIDENCE_PER_CONCEPT, createInitialState, defaultPreferences } from '../../src/domain/state';
import { sanitizeState } from '../../src/persistence/sanitize';
import { T0 } from '../helpers/fixtures';

/** Estado válido serializado (como viria do IndexedDB) com campos sobrescritos. */
function raw(patch: (data: Record<string, any>) => void): unknown {
  const data = JSON.parse(JSON.stringify(createInitialState(T0))) as Record<string, any>;
  patch(data);
  return data;
}

describe('sanitizeState', () => {
  it('estado válido passa sem alterações nem avisos', () => {
    const state = createInitialState(T0);
    const result = sanitizeState(JSON.parse(JSON.stringify(state)), T0);
    expect(result.issues).toEqual([]);
    expect(result.state).toEqual(state);
  });

  it.each([null, undefined, 'texto', 42, [], true])('entrada %j vira perfil novo, sem exceção', (input) => {
    const result = sanitizeState(input, T0);
    expect(result.state).toEqual(createInitialState(T0));
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('perfil e progresso com tipo errado são reiniciados e avisados', () => {
    const result = sanitizeState({ profile: [], progress: 'x', preferences: 7 }, T0);
    expect(result.state.profile).toEqual(createInitialState(T0).profile);
    expect(result.state.progress).toEqual(createInitialState(T0).progress);
    expect(result.state.preferences).toEqual(defaultPreferences());
    expect(result.issues).toHaveLength(2);
  });

  it('tipos errados e números fora do intervalo nas preferências e no perfil', () => {
    const { state } = sanitizeState(
      raw((d) => {
        d.profile.nickname = 12345;
        d.profile.startingLevel = 'hacker';
        d.profile.focusAreas = ['teclado', 'inexistente', 7, 'teclado', 'redes'];
        d.profile.onboardingCompleted = 'sim';
        d.profile.selectedTitle = 'x'.repeat(100);
        d.preferences.volume = 5;
        d.preferences.fontScale = 2;
        d.preferences.theme = 'neon';
        d.preferences.soundEnabled = 'true';
        d.preferences.keyboardPlatform = 'linux';
      }),
      T0,
    );
    expect(state.profile.nickname).toBe('Agente');
    expect(state.profile.startingLevel).toBe('iniciante');
    expect(state.profile.focusAreas).toEqual(['teclado', 'redes']);
    expect(state.profile.onboardingCompleted).toBe(false);
    expect(state.profile.selectedTitle).toHaveLength(40);
    expect(state.preferences).toEqual({ ...defaultPreferences(), volume: 1 });
  });

  it('apelido longo é cortado; volume negativo vai a 0', () => {
    const { state } = sanitizeState(
      raw((d) => {
        d.profile.nickname = '  ' + 'N'.repeat(40);
        d.preferences.volume = -3;
      }),
      T0,
    );
    expect(state.profile.nickname.length).toBeLessThanOrEqual(24);
    expect(state.preferences.volume).toBe(0);
  });

  it('onboarding concluído sem nível declarado não vale', () => {
    const { state } = sanitizeState(raw((d) => ((d.profile.onboardingCompleted = true), (d.profile.startingLevel = null))), T0);
    expect(state.profile.onboardingCompleted).toBe(false);
    expect(state.profile.startingLevel).toBeNull();
  });

  it('XP inválido, negativo, fracionado ou absurdo', () => {
    const xp = (value: unknown) => sanitizeState(raw((d) => (d.progress.xp = value)), T0).state.progress.xp;
    expect(xp('muito')).toBe(0);
    expect(xp(-50)).toBe(0);
    expect(xp(12.7)).toBe(12);
    expect(xp(Number.NaN)).toBe(0);
    expect(xp(Number.POSITIVE_INFINITY)).toBe(0);
    expect(xp(1e15)).toBe(10_000_000);
  });

  it('registros de missão: id inválido descartado, números limitados', () => {
    const { state, issues } = sanitizeState(
      raw((d) => {
        d.progress.missions = {
          'Missão Inválida!': { completions: 1 },
          'f01-alfa': {
            contentVersion: 'dois',
            attempts: -3,
            completions: 2.9,
            failures: 'x',
            bestAccuracy: 7,
            lastAccuracy: -1,
            xpEarned: 50,
            firstCompletedAt: null,
            lastCompletedAt: T0,
            lastAttemptAt: -5,
            lastReviewXpAt: 'ontem',
          },
          'f02-beta': 'lixo',
        };
      }),
      T0,
    );
    expect(Object.keys(state.progress.missions)).toEqual(['f01-alfa']);
    expect(state.progress.missions['f01-alfa']).toEqual({
      contentVersion: 1,
      attempts: 0,
      completions: 2,
      failures: 0,
      bestAccuracy: 1,
      lastAccuracy: 0,
      xpEarned: 50,
      firstCompletedAt: T0,
      lastCompletedAt: T0,
      lastAttemptAt: null,
      lastReviewXpAt: null,
    });
    expect(issues.filter((i) => i.startsWith('Registro de missão inválido'))).toHaveLength(2);
  });

  it('conceitos inválidos e evidências malformadas', () => {
    const { state } = sanitizeState(
      raw((d) => {
        d.progress.concepts = {
          'conceito-falso': [{ at: T0, correct: true, firstTry: true, source: 'missao' }],
          phishing: [
            { at: T0, correct: 'sim', firstTry: true, source: 'hacker' },
            { correct: true },
            'texto',
            { at: 'ontem', correct: true },
            { at: T0 + 1, correct: true, firstTry: false, source: 'treino' },
          ],
          lixeira: 'nao-e-lista',
          backup: [],
          'teclas-essenciais': Array.from({ length: 30 }, (_, i) => ({ at: T0 + i, correct: true, firstTry: true, source: 'missao' })),
        };
      }),
      T0,
    );
    expect(Object.keys(state.progress.concepts).sort()).toEqual(['phishing', 'teclas-essenciais']);
    expect(state.progress.concepts.phishing).toEqual([
      { at: T0, correct: false, firstTry: true, source: 'missao' },
      { at: T0 + 1, correct: true, firstTry: false, source: 'treino' },
    ]);
    expect(state.progress.concepts['teclas-essenciais']).toHaveLength(MAX_EVIDENCE_PER_CONCEPT);
    expect(state.progress.concepts['teclas-essenciais']![0]!.at).toBe(T0 + 10);
  });

  it('conquistas inexistentes ou com data inválida são removidas', () => {
    const { state } = sanitizeState(
      raw((d) => {
        d.progress.achievements = { 'primeiro-passo': T0, 'conquista-inventada': T0, 'mao-firme': 'ontem', __proto__x: 1 };
      }),
      T0,
    );
    expect(state.progress.achievements).toEqual({ 'primeiro-passo': T0 });
  });

  it('listas do progresso filtradas', () => {
    const { state } = sanitizeState(
      raw((d) => {
        d.progress.processedRuns = ['r1', 2, null, 'r2'];
        d.progress.codexViewed = ['phishing', 'phishing', 'nao-existe', 3];
        d.progress.activeDays = ['2026-03-14', '14/03/2026', '2026-03-14', 20260315];
        d.progress.trainingXpByDay = { '2026-03-14': 5000, ontem: 10, '2026-03-15': 'x' };
      }),
      T0,
    );
    expect(state.progress.processedRuns).toEqual(['r1', 'r2']);
    expect(state.progress.codexViewed).toEqual(['phishing']);
    expect(state.progress.activeDays).toEqual(['2026-03-14']);
    expect(state.progress.trainingXpByDay).toEqual({ '2026-03-14': 1000, '2026-03-15': 0 });
  });

  it('estatísticas coerentes', () => {
    const { state } = sanitizeState(
      raw((d) => {
        d.progress.stats = {
          missionsStarted: 1,
          runsCompleted: 5,
          flawlessRuns: -2,
          bestTypingWpm: 9999,
          totalTimeMs: 'muito',
          stepKindsCorrect: { quiz: 3, voar: 10, terminal: -1 },
          categories: {
            teclado: { steps: 4, firstTry: 9, scoreSum: 12 },
            inventada: { steps: 1, firstTry: 1, scoreSum: 1 },
            redes: 'x',
          },
        };
      }),
      T0,
    );
    const st = state.progress.stats;
    expect(st.missionsStarted).toBe(5);
    expect(st.flawlessRuns).toBe(0);
    expect(st.bestTypingWpm).toBe(250);
    expect(st.totalTimeMs).toBe(0);
    expect(st.stepKindsCorrect).toEqual({ quiz: 3, terminal: 0 });
    expect(st.categories).toEqual({ teclado: { steps: 4, firstTry: 4, scoreSum: 4 } });
  });

  it('avaliação com valores fora do intervalo', () => {
    const { state } = sanitizeState(
      raw((d) => {
        d.profile.assessment = {
          completedAt: T0,
          skipped: false,
          score: 3,
          perCategory: { teclado: { correct: 9, total: 2 }, falsa: { correct: 1, total: 1 } },
          questionIds: ['a', 2, 'b'],
        };
      }),
      T0,
    );
    expect(state.profile.assessment).toEqual({
      completedAt: T0,
      skipped: false,
      score: 1,
      perCategory: { teclado: { correct: 2, total: 2 } },
      questionIds: ['a', 'b'],
    });
  });

  it('tentativas e histórico malformados', () => {
    const goodAttempt = { runId: 'r1', missionId: 'f01-alfa', category: 'teclado', at: T0, accuracy: 3, passed: 'sim', durationMs: -1, mistakes: 2, xp: 50, kind: 'robo' };
    const { state } = sanitizeState(
      raw((d) => {
        d.attempts = [goodAttempt, { runId: 'r2', missionId: 'x', category: 'inventada', at: T0 }, { missionId: 'x' }, 'lixo'];
        d.history = [
          { id: 'h1', at: T0, type: 'invasao', text: 'Algo', xp: 'muito' },
          { id: 'h2', at: T0, type: 'nivel' },
          { id: 'h3', at: T0, type: 'nivel', text: 'Subiu', xp: 30 },
        ];
      }),
      T0,
    );
    expect(state.attempts).toEqual([
      { runId: 'r1', missionId: 'f01-alfa', category: 'teclado', at: T0, accuracy: 1, passed: false, durationMs: 0, mistakes: 2, xp: 50, kind: 'missao' },
    ]);
    expect(state.history).toEqual([
      { id: 'h1', at: T0, type: 'missao-concluida', text: 'Algo' },
      { id: 'h3', at: T0, type: 'nivel', text: 'Subiu', xp: 30 },
    ]);
  });

  it('listas longas demais são cortadas', () => {
    const attempt = { runId: 'r', missionId: 'm', category: 'teclado', at: T0, accuracy: 1, passed: true, durationMs: 1, mistakes: 0, xp: 0, kind: 'missao' };
    const { state } = sanitizeState(raw((d) => (d.attempts = Array.from({ length: MAX_ATTEMPTS + 50 }, () => attempt))), T0);
    expect(state.attempts).toHaveLength(MAX_ATTEMPTS);
  });

  it('datas do save no futuro distante são limitadas', () => {
    const { state } = sanitizeState(raw((d) => ((d.createdAt = T0 * 10), (d.updatedAt = 'ontem'))), T0);
    expect(state.createdAt).toBeLessThanOrEqual(T0 + 86_400_000);
    expect(state.updatedAt).toBe(T0);
  });

  it('é idempotente: sanitizar o resultado não muda nada', () => {
    const messy = raw((d) => {
      d.progress.xp = -1;
      d.progress.missions = { 'f01-alfa': { completions: 1, bestAccuracy: 2 } };
      d.progress.concepts = { phishing: [{ at: T0, correct: 1 }] };
      d.preferences.volume = 9;
    });
    const once = sanitizeState(messy, T0);
    const twice = sanitizeState(JSON.parse(JSON.stringify(once.state)), T0);
    expect(twice.state).toEqual(once.state);
    expect(twice.issues).toEqual([]);
  });
});
