/**
 * Sincronização entre dispositivos — interface preparada, SEM serviço conectado.
 *
 * O GitHub Pages só hospeda arquivos estáticos; contas e sincronização exigem um
 * serviço externo (ex.: Supabase com Row Level Security). O desenho proposto está em
 * docs/SYNC.md. Enquanto nenhuma implementação real for registrada, o jogo informa
 * honestamente que o progresso fica apenas neste navegador.
 */
import type { GameState } from '../domain/state';

export type SyncStatus =
  | { state: 'desativada'; reason: string }
  | { state: 'sincronizado'; at: number }
  | { state: 'pendente' }
  | { state: 'erro'; message: string };

export interface RemoteProgressRepository {
  readonly provider: string;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  pull(): Promise<{ state: unknown; updatedAt: number } | null>;
  push(state: GameState): Promise<void>;
}

let remote: RemoteProgressRepository | null = null;

/** Ponto de extensão para uma implementação real (ver docs/SYNC.md). */
export function registerRemote(repository: RemoteProgressRepository | null): void {
  remote = repository;
}

export function getRemote(): RemoteProgressRepository | null {
  return remote;
}

export function currentSyncStatus(): SyncStatus {
  if (!remote) {
    return {
      state: 'desativada',
      reason: 'Nenhum serviço de contas está configurado nesta publicação. Seu progresso fica salvo apenas neste navegador e dispositivo.',
    };
  }
  return { state: 'pendente' };
}
