import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import type { GameStore, StoreSnapshot } from './store';

const StoreContext = createContext<GameStore | null>(null);

export function GameProvider({ store, children }: { store: GameStore; children: ReactNode }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): GameStore {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore precisa estar dentro de <GameProvider>.');
  return store;
}

export function useGame(): StoreSnapshot {
  const store = useStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
