/**
 * Roteador por hash (#/caminho). Compatível com hospedagem estática no GitHub Pages:
 * recarregar ou abrir um link direto nunca chega ao servidor com um caminho profundo.
 */
import { useSyncExternalStore } from 'react';

export type RouteName =
  | 'home'
  | 'onboarding'
  | 'campaign'
  | 'missions'
  | 'mission'
  | 'play'
  | 'training'
  | 'trainingSession'
  | 'profile'
  | 'stats'
  | 'achievements'
  | 'codex'
  | 'codexEntry'
  | 'settings'
  | 'notFound';

export interface Route {
  name: RouteName;
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
}

const TABLE: [RouteName, RegExp, string[]][] = [
  ['home', /^\/$/, []],
  ['onboarding', /^\/inicio$/, []],
  ['campaign', /^\/campanha(?:\/([a-z-]+))?$/, ['sector']],
  ['missions', /^\/missoes$/, []],
  ['mission', /^\/missao\/([a-z0-9-]+)$/, ['id']],
  ['play', /^\/missao\/([a-z0-9-]+)\/jogar$/, ['id']],
  ['training', /^\/treino$/, []],
  ['trainingSession', /^\/treino\/([a-z-]+)$/, ['mode']],
  ['profile', /^\/perfil$/, []],
  ['stats', /^\/estatisticas$/, []],
  ['achievements', /^\/conquistas$/, []],
  ['codex', /^\/codex$/, []],
  ['codexEntry', /^\/codex\/([a-z0-9-]+)$/, ['id']],
  ['settings', /^\/config$/, []],
];

export function parseHash(hash: string): Route {
  const raw = decodeURIComponent(hash.replace(/^#/, '')) || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = (pathPart || '/').replace(/\/+$/, '') || '/';
  const query = new URLSearchParams(queryPart);
  for (const [name, pattern, keys] of TABLE) {
    const match = pattern.exec(path);
    if (match) {
      const params: Record<string, string> = {};
      keys.forEach((k, i) => {
        if (match[i + 1]) params[k] = match[i + 1]!;
      });
      return { name, path, params, query };
    }
  }
  return { name: 'notFound', path, params: {}, query };
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

const getHash = () => window.location.hash;

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash, () => '');
  return parseHash(hash);
}

export function href(path: string): string {
  return `#${path}`;
}

export function navigate(path: string, options: { replace?: boolean } = {}): void {
  const target = href(path);
  if (options.replace) {
    window.history.replaceState(null, '', target);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else if (window.location.hash !== target) {
    window.location.hash = path;
  }
}

/**
 * Acesso por caminho sem "#" (ex.: /repo/missoes vindo do 404.html do GitHub Pages):
 * converte em rota de hash mantendo o caminho-base.
 */
export function redirectPathToHash(base: string): void {
  const { pathname, hash, search } = window.location;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  if (hash || !pathname.startsWith(normalizedBase)) return;
  const rest = pathname.slice(normalizedBase.length).replace(/^index\.html$/, '');
  if (!rest) return;
  window.history.replaceState(null, '', `${normalizedBase}${search}#/${rest.replace(/\/+$/, '')}`);
}
