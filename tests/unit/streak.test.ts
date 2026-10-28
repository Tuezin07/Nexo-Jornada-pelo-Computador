import { describe, expect, it } from 'vitest';
import { dayKey } from '../../src/domain/state';
import { streakInfo } from '../../src/domain/streak';
import { DAY, T0 } from '../helpers/fixtures';

/** Chave do dia `offset` dias antes de T0. */
const ago = (offset: number) => dayKey(T0 - offset * DAY);

describe('streakInfo', () => {
  it('sem dias ativos', () => {
    expect(streakInfo([], T0)).toEqual({ current: 0, longest: 0 });
  });

  it('só hoje', () => {
    expect(streakInfo([ago(0)], T0)).toEqual({ current: 1, longest: 1 });
  });

  it('três dias seguidos até hoje', () => {
    expect(streakInfo([ago(2), ago(1), ago(0)], T0)).toEqual({ current: 3, longest: 3 });
  });

  it('a sequência continua valendo se o último dia foi ontem', () => {
    expect(streakInfo([ago(3), ago(2), ago(1)], T0)).toEqual({ current: 3, longest: 3 });
  });

  it('dois dias sem jogar zeram a sequência atual, mas não a maior', () => {
    expect(streakInfo([ago(4), ago(3), ago(2)], T0)).toEqual({ current: 0, longest: 3 });
  });

  it('a atual é a última sequência; a maior pode ser antiga', () => {
    const days = [ago(10), ago(9), ago(8), ago(7), ago(1), ago(0)];
    expect(streakInfo(days, T0)).toEqual({ current: 2, longest: 4 });
  });

  it('ignora duplicados, ordem e entradas inválidas', () => {
    const days = [ago(0), 'ontem', ago(1), ago(0), '2026-3-1', ago(2)];
    expect(streakInfo(days, T0)).toEqual({ current: 3, longest: 3 });
  });

  it('atravessa virada de mês e de ano', () => {
    const feb = new Date(2026, 2, 1, 12).getTime();
    expect(streakInfo(['2026-02-27', '2026-02-28', '2026-03-01'], feb)).toEqual({ current: 3, longest: 3 });
    const jan = new Date(2027, 0, 1, 12).getTime();
    expect(streakInfo(['2026-12-30', '2026-12-31', '2027-01-01'], jan)).toEqual({ current: 3, longest: 3 });
  });

  it('dayKey usa a data local no formato AAAA-MM-DD', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59).getTime())).toBe('2026-01-05');
    expect(dayKey(new Date(2026, 0, 6, 0, 1).getTime())).toBe('2026-01-06');
  });
});
