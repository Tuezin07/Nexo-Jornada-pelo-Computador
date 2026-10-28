import { dayKey } from './state';

const DAY_MS = 86_400_000;

function toUtcDay(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y!, (m ?? 1) - 1, d ?? 1) / DAY_MS;
}

/**
 * Sequência de dias ativos. A sequência atual continua valendo se o último dia
 * ativo foi hoje ou ontem.
 */
export function streakInfo(activeDays: string[], now: number): { current: number; longest: number } {
  const days = [...new Set(activeDays)].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).map(toUtcDay).sort((a, b) => a - b);
  if (days.length === 0) return { current: 0, longest: 0 };
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i]! - days[i - 1]! === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const today = toUtcDay(dayKey(now));
  const last = days[days.length - 1]!;
  let current = 0;
  if (today - last <= 1) {
    current = 1;
    for (let i = days.length - 1; i > 0 && days[i]! - days[i - 1]! === 1; i--) current++;
  }
  return { current, longest };
}
