/// <reference types="vitest/config" />
import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Caminho-base da publicação. No GitHub Pages de projeto o site fica em
 * https://<usuario>.github.io/<repositorio>/, então o workflow define
 * BASE_PATH a partir de `actions/configure-pages`. Localmente o padrão é "/".
 */
export function normalizeBase(raw: string | undefined): string {
  const value = (raw ?? '').trim();
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

/**
 * O GitHub Pages serve 404.html para caminhos desconhecidos. Copiar o index
 * garante que um acesso direto a uma URL antiga ou sem "#" ainda carregue o jogo;
 * o roteador converte o caminho em rota de hash (ver src/app/router.ts).
 */
function spaFallback(): Plugin {
  let outDir = 'dist';
  return {
    name: 'nexo-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH),
  plugins: [react(), spaFallback()],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
  },
});
