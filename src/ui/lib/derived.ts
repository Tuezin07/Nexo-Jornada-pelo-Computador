/**
 * Dados derivados do estado (nível, setores abertos, recomendações...). Calculados
 * a partir dos registros persistidos; nunca são gravados.
 */
import { useMemo } from 'react';
import { codexSuggestions, recommendMissions } from '../../domain/recommend';
import { unlockedSectors } from '../../domain/unlock';
import { levelFromXp, rankForLevel } from '../../domain/xp';
import { streakInfo } from '../../domain/streak';
import { completedMissionIds } from '../../domain/state';
import { useGame, useStore } from '../../state/GameContext';

export function useDerived() {
  const { state } = useGame();
  const store = useStore();
  return useMemo(() => {
    const now = store.now();
    const level = levelFromXp(state.progress.xp);
    return {
      now,
      level,
      rank: rankForLevel(level.level),
      title: state.profile.selectedTitle ?? rankForLevel(level.level),
      sectors: unlockedSectors(state, store.catalog),
      completed: completedMissionIds(state),
      recommendations: recommendMissions(state, store.catalog, now, 3),
      codexHints: codexSuggestions(state, now, 2),
      streak: streakInfo(state.progress.activeDays, now),
    };
  }, [state, store]);
}
