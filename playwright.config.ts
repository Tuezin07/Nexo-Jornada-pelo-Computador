import { defineConfig, devices } from '@playwright/test';

/**
 * Os testes E2E rodam contra o BUILD DE PRODUÇÃO servido num subcaminho, como no
 * GitHub Pages de projeto (https://usuario.github.io/repositorio/).
 * Localmente usa o Microsoft Edge instalado; no CI usa o Chromium do Playwright.
 */
function normalizeBase(raw: string | undefined): string {
  const value = (raw ?? '').trim();
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

const base = normalizeBase(process.env.BASE_PATH ?? '/nexo-teste/');
const port = 4173;
const isCI = Boolean(process.env.CI);
const localChannel = process.env.PW_CHANNEL ?? (isCI ? undefined : 'msedge');

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  retries: isCI ? 1 : 0,
  timeout: 60_000,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}${base}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...(localChannel ? { channel: localChannel } : {}),
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 860 } } },
    { name: 'celular', use: { ...devices['Pixel 7'], ...(localChannel ? { channel: localChannel } : {}) } },
  ],
  webServer: {
    command: isCI ? `npx vite preview --port ${port} --strictPort` : `npm run build && npx vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}${base}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
    env: { BASE_PATH: base },
  },
});
