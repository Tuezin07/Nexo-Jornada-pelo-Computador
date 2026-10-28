import { describe, expect, it } from 'vitest';
import type { MissionDefinition } from '../../src/content/types';
import { createCatalog } from '../../src/domain/catalog';
import { codexSuggestions, recommendMissions, strugglingCategories, targetDifficulty } from '../../src/domain/recommend';
import { emptyMissionRecord, type AttemptRecord, type ConceptEvidence, type GameState } from '../../src/domain/state';
import { HOUR, SYNTHETIC_SECTORS, T0, freshState, makeMission, withCompleted } from '../helpers/fixtures';

const MISSIONS: MissionDefinition[] = [
  makeMission({ id: 'f01-teclado-a', order: 1, category: 'teclado', concepts: ['teclas-essenciais'] }),
  makeMission({ id: 'f02-teclado-b', order: 2, category: 'teclado', concepts: ['atalho-desfazer'] }),
  makeMission({ id: 'f03-teclado-c', order: 3, category: 'teclado', concepts: ['area-transferencia'] }),
  makeMission({ id: 'f04-arquivos', order: 4, category: 'arquivos', concepts: ['arquivos-pastas'] }),
  makeMission({ id: 'f05-seguranca', order: 5, category: 'seguranca', concepts: ['senhas-fortes'] }),
  makeMission({ id: 'f06-internet', order: 6, category: 'internet', concepts: ['url-anatomia'] }),
  makeMission({ id: 'f07-teclado-dificil', order: 7, category: 'teclado', difficulty: 3, concepts: ['atalhos-texto'] }),
  makeMission({ id: 'f08-depois-a', order: 8, category: 'produtividade', prerequisites: ['f01-teclado-a'], concepts: ['salvar-como'] }),
  makeMission({ id: 's01-sistema', sector: 'sistema', order: 1, category: 'sistema', concepts: ['sistema-operacional'] }),
];
const catalog = createCatalog(MISSIONS, SYNTHETIC_SECTORS);

const ids = (state: GameState, now = T0, limit?: number) => recommendMissions(state, catalog, now, limit).map((r) => r.mission.id);
const ev = (at: number, correct: boolean): ConceptEvidence => ({ at, correct, firstTry: true, source: 'missao' });
const withProfile = (patch: Partial<GameState['profile']>): GameState => {
  const s = freshState();
  return { ...s, profile: { ...s.profile, onboardingCompleted: true, startingLevel: 'iniciante', ...patch } };
};
const attempt = (missionId: string, category: AttemptRecord['category'], passed: boolean, at = T0): AttemptRecord => ({
  runId: `${missionId}-${at}`,
  missionId,
  category,
  at,
  accuracy: passed ? 0.9 : 0.3,
  passed,
  durationMs: 1000,
  mistakes: passed ? 0 : 3,
  xp: 0,
  kind: 'missao',
});

describe('recomendações', () => {
  it('sem preferências: ordem da campanha, com razões legíveis', () => {
    const recs = recommendMissions(withProfile({}), catalog, T0);
    expect(recs.map((r) => r.mission.id)).toEqual(['f01-teclado-a', 'f02-teclado-b', 'f04-arquivos']);
    for (const r of recs) {
      expect(r.type).toBe('nova');
      expect(r.reasons.length).toBeGreaterThan(0);
    }
    expect(recs[0]!.reasons).toContain('A dificuldade combina com o seu desempenho atual.');
  });

  it('é determinística', () => {
    const state = withProfile({ focusAreas: ['internet'] });
    expect(recommendMissions(state, catalog, T0, 5)).toEqual(recommendMissions(state, catalog, T0, 5));
  });

  it('prioriza as áreas marcadas no onboarding e explica por quê', () => {
    const recs = recommendMissions(withProfile({ focusAreas: ['seguranca', 'internet'] }), catalog, T0);
    expect(recs.slice(0, 2).map((r) => r.mission.id)).toEqual(['f05-seguranca', 'f06-internet']);
    expect(recs[0]!.reasons).toContain('Você marcou Segurança como uma área para melhorar.');
  });

  it('"quero tudo" ignora as áreas marcadas', () => {
    expect(ids(withProfile({ focusAreas: ['seguranca'], wantsEverything: true }))).toEqual(ids(withProfile({})));
  });

  it('variedade: no máximo 2 recomendações da mesma categoria', () => {
    const recs = recommendMissions(withProfile({ focusAreas: ['teclado'] }), catalog, T0, 10);
    const teclado = recs.filter((r) => r.mission.category === 'teclado');
    expect(teclado).toHaveLength(2);
    expect(recs.length).toBeGreaterThan(2);
  });

  it('não recomenda missões bloqueadas por setor ou por requisito', () => {
    const all = ids(withProfile({}), T0, 20);
    expect(all).not.toContain('s01-sistema');
    expect(all).not.toContain('f08-depois-a');
  });

  it('continuidade: pré-requisito recém-concluído vira razão', () => {
    const state = withCompleted(withProfile({}), ['f01-teclado-a'], T0 - HOUR);
    const recs = recommendMissions(state, catalog, T0, 10);
    const next = recs.find((r) => r.mission.id === 'f08-depois-a');
    expect(next).toBeDefined();
    expect(next!.reasons.some((r) => r.startsWith('Continua de onde você parou: Missão f01-teclado-a'))).toBe(true);
  });

  it('missão concluída não volta antes do intervalo de revisão', () => {
    let state = withCompleted(withProfile({}), ['f01-teclado-a'], T0 - 5 * HOUR);
    state.progress.concepts['teclas-essenciais'] = [ev(T0 - 5 * HOUR, false)];
    expect(ids(state, T0, 20)).not.toContain('f01-teclado-a');
    state = withCompleted(state, ['f01-teclado-a'], T0 - 19 * HOUR);
    expect(ids(state, T0, 20)).not.toContain('f01-teclado-a');
  });

  it('reforço: missão concluída com erro recente no conceito volta como "reforco"', () => {
    const state = withCompleted(withProfile({}), ['f01-teclado-a'], T0 - 25 * HOUR);
    state.progress.concepts['teclas-essenciais'] = [ev(T0 - 26 * HOUR, true), ev(T0 - 25 * HOUR, false)];
    const recs = recommendMissions(state, catalog, T0);
    expect(recs[0]!.mission.id).toBe('f01-teclado-a');
    expect(recs[0]!.type).toBe('reforco');
    expect(recs[0]!.reasons[0]).toBe('Reforço: você errou recentemente Teclas essenciais.');
  });

  it('revisão espaçada: conceito praticado há mais de 20 h volta como "revisao"', () => {
    const state = withCompleted(withProfile({}), ['f01-teclado-a'], T0 - 25 * HOUR);
    state.progress.concepts['teclas-essenciais'] = [ev(T0 - 26 * HOUR, true), ev(T0 - 25 * HOUR, true)];
    const rec = recommendMissions(state, catalog, T0, 10).find((r) => r.mission.id === 'f01-teclado-a');
    expect(rec?.type).toBe('revisao');
    expect(rec?.reasons[0]).toMatch(/^Revisão espaçada: rever Teclas essenciais/);
  });

  it('missão concluída e conceito em dia não é recomendada', () => {
    const state = withCompleted(withProfile({}), ['f01-teclado-a'], T0 - 25 * HOUR);
    state.progress.concepts['teclas-essenciais'] = [ev(T0 - 72 * HOUR, true), ev(T0 - 48 * HOUR, true), ev(T0 - 25 * HOUR, true)];
    expect(ids(state, T0, 20)).not.toContain('f01-teclado-a');
  });

  it('categoria com reprovações recentes: missão acessível ganha reforço, difícil perde prioridade', () => {
    const base = withProfile({});
    const state: GameState = {
      ...base,
      attempts: [attempt('f02-teclado-b', 'teclado', false, T0 - 2 * HOUR), attempt('f02-teclado-b', 'teclado', false, T0 - HOUR)],
      progress: { ...base.progress, missions: { 'f02-teclado-b': { ...emptyMissionRecord(1), attempts: 2, failures: 2, lastAttemptAt: T0 - HOUR } } },
    };
    expect([...strugglingCategories(state)]).toEqual(['teclado']);
    const recs = recommendMissions(state, catalog, T0, 20);
    const easy = recs.find((r) => r.mission.id === 'f01-teclado-a')!;
    expect(easy.reasons).toContain('Uma missão mais acessível para reforçar a base de Teclado.');
    const retry = recs.find((r) => r.mission.id === 'f02-teclado-b')!;
    expect(retry.reasons).toContain('Você já tentou esta missão; com a explicação fresca, vale uma nova tentativa.');
    // missão acima da dificuldade-alvo perde prioridade enquanto a categoria está difícil
    const only = createCatalog([MISSIONS[6]!], SYNTHETIC_SECTORS);
    const calm = recommendMissions(withProfile({}), only, T0)[0]!;
    const tense = recommendMissions(state, only, T0)[0]!;
    expect(tense.mission.id).toBe('f07-teclado-dificil');
    expect(tense.score).toBe(calm.score - 25);
  });

  it('uma única reprovação não marca a categoria', () => {
    const state = { ...withProfile({}), attempts: [attempt('f01-teclado-a', 'teclado', false)] };
    expect(strugglingCategories(state).size).toBe(0);
  });

  it('respeita o limite', () => {
    expect(ids(withProfile({}), T0, 1)).toHaveLength(1);
  });
});

describe('dificuldade-alvo', () => {
  it('parte do nível declarado e é ajustada pela avaliação e pelo desempenho real', () => {
    expect(targetDifficulty(withProfile({ startingLevel: 'iniciante' }), 'teclado')).toBe(1);
    expect(targetDifficulty(withProfile({ startingLevel: 'veterano' }), 'teclado')).toBeCloseTo(2.4);
    const assessed = withProfile({
      startingLevel: 'casual',
      assessment: { completedAt: T0, skipped: false, score: 1, perCategory: { teclado: { correct: 1, total: 1 }, redes: { correct: 0, total: 2 } }, questionIds: [] },
    });
    expect(targetDifficulty(assessed, 'teclado')).toBeCloseTo(2);
    expect(targetDifficulty(assessed, 'redes')).toBeCloseTo(1.2);
    const strong = { ...assessed, progress: { ...assessed.progress, stats: { ...assessed.progress.stats, categories: { teclado: { steps: 4, firstTry: 4, scoreSum: 3.6 } } } } };
    expect(targetDifficulty(strong, 'teclado')).toBeCloseTo(2.6);
  });

  it('limitada entre 1 e 4', () => {
    const weak = withProfile({ startingLevel: 'iniciante' });
    weak.progress.stats.categories.teclado = { steps: 10, firstTry: 0, scoreSum: 2 };
    expect(targetDifficulty(weak, 'teclado')).toBe(1);
    const top = withProfile({
      startingLevel: 'mestre',
      assessment: { completedAt: T0, skipped: false, score: 1, perCategory: { teclado: { correct: 1, total: 1 } }, questionIds: [] },
    });
    top.progress.stats.categories.teclado = { steps: 10, firstTry: 10, scoreSum: 10 };
    expect(targetDifficulty(top, 'teclado')).toBe(4);
  });
});

describe('sugestões do Codex', () => {
  it('conceitos com erro recente, mais recentes primeiro', () => {
    const state = freshState();
    state.progress.concepts.phishing = [ev(T0 - 2 * HOUR, false)];
    state.progress.concepts.lixeira = [ev(T0 - HOUR, false)];
    state.progress.concepts.backup = [ev(T0 - HOUR, true)];
    expect(codexSuggestions(state, T0).map((s) => s.concept)).toEqual(['lixeira', 'phishing']);
  });
});
