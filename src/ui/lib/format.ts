import type { CategoryId, Difficulty, SectorId, StartingLevel } from '../../content/types';
import type { HistoryType } from '../../domain/state';
import type { IconName } from '../components/Icon';

export const HISTORY_ICON: Record<HistoryType, IconName> = {
  onboarding: 'compass',
  avaliacao: 'target',
  'missao-concluida': 'check',
  'missao-tentativa': 'repeat',
  revisao: 'repeat',
  treino: 'dumbbell',
  nivel: 'star',
  conquista: 'trophy',
  setor: 'unlock',
};

export function pct(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : `${Math.round(value * 100)}%`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h} h ${m} min`;
  if (m > 0) return s > 0 && m < 10 ? `${m} min ${s} s` : `${m} min`;
  return `${s} s`;
}

const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const DATETIME_FORMAT = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function formatDate(ts: number): string {
  return DATE_FORMAT.format(ts);
}

export function formatDateTime(ts: number): string {
  return DATETIME_FORMAT.format(ts);
}

export function relativeTime(ts: number, now: number): string {
  const diff = Math.max(0, now - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'ontem';
  if (d < 7) return `há ${d} dias`;
  return formatDate(ts);
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: 'Básico',
  2: 'Intermediário',
  3: 'Avançado',
  4: 'Especialista',
};

export const SECTOR_ICON: Record<SectorId, IconName> = {
  fundamentos: 'layers',
  sistema: 'cpu',
  'rede-segura': 'shield',
  diagnostico: 'search',
  eficiencia: 'bolt',
};

export const CATEGORY_ICON: Record<CategoryId, IconName> = {
  teclado: 'keyboard',
  sistema: 'window',
  arquivos: 'folder',
  internet: 'globe',
  navegadores: 'compass',
  programas: 'download',
  configuracoes: 'sliders',
  seguranca: 'shield',
  diagnostico: 'wrench',
  produtividade: 'bolt',
  hardware: 'cpu',
  redes: 'wifi',
  comandos: 'terminal',
};

export interface StartingLevelInfo {
  id: StartingLevel;
  label: string;
  tagline: string;
  description: string;
  expectation: string;
}

export const STARTING_LEVELS: StartingLevelInfo[] = [
  {
    id: 'iniciante',
    label: 'Iniciante',
    tagline: 'Estou começando agora',
    description: 'Uso pouco o computador ou fico inseguro com teclado, mouse e arquivos.',
    expectation: 'Começa pelos Fundamentos, com explicações passo a passo e desafios curtos.',
  },
  {
    id: 'casual',
    label: 'Casual',
    tagline: 'Me viro no dia a dia',
    description: 'Faço tarefas simples, mas me perco quando algo foge do costume.',
    expectation: 'Fundamentos e Domínio do sistema abertos; o jogo reforça o que falta.',
  },
  {
    id: 'veterano',
    label: 'Veterano',
    tagline: 'Uso bastante e quero ir além',
    description: 'Uso o computador todo dia e quero atalhos, segurança e eficiência.',
    expectation: 'Três setores abertos, com desafios mais exigentes desde o início.',
  },
  {
    id: 'mestre',
    label: 'Mestre',
    tagline: 'Quero dominar de verdade',
    description: 'Resolvo problemas sozinho e quero diagnóstico, terminal e automação.',
    expectation: 'Todos os setores abertos; recomendações focam nos desafios avançados.',
  },
];

export function sectorStyle(sector: SectorId): React.CSSProperties {
  return { '--sector-color': `var(--sector-${sector})` } as React.CSSProperties;
}
