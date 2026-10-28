/**
 * Conquistas: condições puras avaliadas sobre o estado derivado.
 * Uma conquista é registrada uma única vez (com data) em `progress.achievements`.
 * Algumas desbloqueiam um título cosmético que o jogador pode exibir no perfil.
 */
import type { SectorId } from '../content/types';
import { CONCEPT_IDS } from '../content/concepts';
import type { Catalog } from './catalog';
import { conceptMastery } from './mastery';
import { completedMissionIds, type AggregateStats, type GameState } from './state';
import { sectorProgress } from './unlock';
import { levelFromXp } from './xp';
import { streakInfo } from './streak';

export type AchievementIcon =
  | 'spark'
  | 'compass'
  | 'target'
  | 'crosshair'
  | 'layers'
  | 'cpu'
  | 'shield'
  | 'search'
  | 'bolt'
  | 'keyboard'
  | 'command'
  | 'folder'
  | 'wrench'
  | 'eye'
  | 'terminal'
  | 'repeat'
  | 'flag'
  | 'brain'
  | 'book'
  | 'medal'
  | 'flame'
  | 'dumbbell';

export interface AchievementContext {
  completed: Set<string>;
  sectors: Record<SectorId, { done: number; total: number }>;
  stats: AggregateStats;
  level: number;
  mastered: number;
  longestStreak: number;
  codexViewed: number;
  assessmentDone: boolean;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: AchievementIcon;
  /** Título cosmético desbloqueado junto. */
  title?: string;
  check: (ctx: AchievementContext) => boolean;
  progress?: (ctx: AchievementContext) => { current: number; target: number };
}

const kind = (ctx: AchievementContext, k: keyof AggregateStats['stepKindsCorrect']) => ctx.stats.stepKindsCorrect[k] ?? 0;

const counter = (target: number, value: (ctx: AchievementContext) => number) => ({
  check: (ctx: AchievementContext) => value(ctx) >= target,
  progress: (ctx: AchievementContext) => ({ current: Math.min(target, value(ctx)), target }),
});

const sector = (id: SectorId) => ({
  check: (ctx: AchievementContext) => {
    const s = ctx.sectors[id];
    return Boolean(s && s.total > 0 && s.done >= s.total);
  },
  progress: (ctx: AchievementContext) => ({ current: ctx.sectors[id]?.done ?? 0, target: ctx.sectors[id]?.total ?? 0 }),
});

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'primeiro-passo', name: 'Primeiro passo', description: 'Conclua sua primeira missão.', icon: 'spark', ...counter(1, (c) => c.completed.size) },
  { id: 'calibrado', name: 'Calibragem', description: 'Responda à avaliação inicial até o fim.', icon: 'compass', check: (c) => c.assessmentDone },
  { id: 'sem-arranhoes', name: 'Sem arranhões', description: 'Conclua uma missão sem erros e sem pistas.', icon: 'target', ...counter(1, (c) => c.stats.flawlessRuns) },
  {
    id: 'mao-firme',
    name: 'Mão firme',
    description: 'Conclua 5 missões sem erros e sem pistas.',
    icon: 'crosshair',
    title: 'Mão Firme',
    ...counter(5, (c) => c.stats.flawlessRuns),
  },
  { id: 'setor-fundamentos', name: 'Base sólida', description: 'Conclua todas as missões de Fundamentos.', icon: 'layers', title: 'Base Sólida', ...sector('fundamentos') },
  { id: 'setor-sistema', name: 'Sistema sob controle', description: 'Conclua todas as missões de Domínio do sistema.', icon: 'cpu', title: 'Sysadmin de Bolso', ...sector('sistema') },
  { id: 'setor-rede-segura', name: 'Escudo ativo', description: 'Conclua todas as missões de Internet e segurança.', icon: 'shield', title: 'Sentinela', ...sector('rede-segura') },
  { id: 'setor-diagnostico', name: 'Caso encerrado', description: 'Conclua todas as missões de Diagnóstico.', icon: 'search', title: 'Detetive de Bugs', ...sector('diagnostico') },
  { id: 'setor-eficiencia', name: 'Fluxo contínuo', description: 'Conclua todas as missões de Eficiência.', icon: 'bolt', title: 'Estrategista', ...sector('eficiencia') },
  {
    id: 'dedos-rapidos',
    name: 'Dedos rápidos',
    description: 'Digite a 35 palavras por minuto com pelo menos 92% de precisão.',
    icon: 'keyboard',
    title: 'Ás do Teclado',
    ...counter(35, (c) => c.stats.bestTypingWpm),
  },
  { id: 'atalhista', name: 'Atalhista', description: 'Acerte 10 desafios de atalho de teclado.', icon: 'command', ...counter(10, (c) => kind(c, 'shortcut')) },
  { id: 'arquivista', name: 'Arquivista', description: 'Conclua 4 simulações do explorador de arquivos.', icon: 'folder', title: 'Arquivista', ...counter(4, (c) => kind(c, 'filesystem')) },
  { id: 'investigacao', name: 'Investigação', description: 'Resolva 5 diagnósticos.', icon: 'wrench', ...counter(5, (c) => kind(c, 'diagnosis')) },
  { id: 'olho-vivo', name: 'Olho vivo', description: 'Desmascare 4 mensagens ou páginas suspeitas.', icon: 'eye', ...counter(4, (c) => kind(c, 'inspect')) },
  { id: 'linha-de-comando', name: 'Linha de comando', description: 'Conclua 3 desafios no terminal.', icon: 'terminal', title: 'Root em Treinamento', ...counter(3, (c) => kind(c, 'terminal')) },
  { id: 'memoria-longa', name: 'Memória longa', description: 'Faça uma revisão espaçada de uma missão já concluída.', icon: 'repeat', ...counter(1, (c) => c.stats.reviews) },
  { id: 'persistencia', name: 'Persistência', description: 'Conclua uma missão em que você não tinha passado antes.', icon: 'flag', ...counter(1, (c) => c.stats.comebacks) },
  { id: 'primeiro-dominio', name: 'Primeiro domínio', description: 'Domine um conceito (acertos consistentes, com revisão em outro dia).', icon: 'brain', ...counter(1, (c) => c.mastered) },
  { id: 'polimata', name: 'Polímata', description: 'Domine 10 conceitos.', icon: 'brain', title: 'Polímata', ...counter(10, (c) => c.mastered) },
  { id: 'curiosidade', name: 'Curiosidade', description: 'Leia 10 entradas do Codex.', icon: 'book', ...counter(10, (c) => c.codexViewed) },
  { id: 'nivel-5', name: 'Nível 5', description: 'Alcance o nível 5.', icon: 'medal', ...counter(5, (c) => c.level) },
  { id: 'nivel-10', name: 'Nível 10', description: 'Alcance o nível 10.', icon: 'medal', title: 'Veterania', ...counter(10, (c) => c.level) },
  { id: 'ritmo', name: 'Ritmo', description: 'Jogue em 3 dias seguidos.', icon: 'flame', ...counter(3, (c) => c.longestStreak) },
  { id: 'constancia', name: 'Constância', description: 'Jogue em 7 dias seguidos.', icon: 'flame', title: 'Constância', ...counter(7, (c) => c.longestStreak) },
  { id: 'academia', name: 'Academia', description: 'Conclua 5 sessões de treino.', icon: 'dumbbell', ...counter(5, (c) => c.stats.trainingSessions) },
];

const BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

export function getAchievement(id: string): AchievementDefinition | undefined {
  return BY_ID.get(id);
}

export function buildAchievementContext(state: GameState, catalog: Catalog, now: number): AchievementContext {
  const sectors = {} as AchievementContext['sectors'];
  for (const s of catalog.sectors) sectors[s.id] = sectorProgress(s.id, state, catalog);
  return {
    completed: completedMissionIds(state),
    sectors,
    stats: state.progress.stats,
    level: levelFromXp(state.progress.xp).level,
    mastered: CONCEPT_IDS.filter((c) => conceptMastery(state, c, now).state === 'dominado').length,
    longestStreak: streakInfo(state.progress.activeDays, now).longest,
    codexViewed: state.progress.codexViewed.length,
    assessmentDone: Boolean(state.profile.assessment && !state.profile.assessment.skipped),
  };
}

/** Conquistas cuja condição está satisfeita e que ainda não foram registradas. */
export function newlyEarned(state: GameState, catalog: Catalog, now: number): AchievementDefinition[] {
  const ctx = buildAchievementContext(state, catalog, now);
  return ACHIEVEMENTS.filter((a) => !(a.id in state.progress.achievements) && a.check(ctx));
}

/** Títulos que o jogador pode exibir. */
export function unlockedTitles(state: GameState): string[] {
  return ACHIEVEMENTS.filter((a) => a.title && a.id in state.progress.achievements).map((a) => a.title!);
}
