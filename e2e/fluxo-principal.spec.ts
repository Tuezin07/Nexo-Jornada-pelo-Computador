import { expect, test } from '@playwright/test';
import { collectErrors, completeOnboarding, solveCurrentStep } from './helpers';

const MISSION = 'f01-primeiro-contato';

test.describe('jornada completa de um jogador novo', () => {
  test('onboarding → missão com erro e acerto → recompensa → perfil → recarregar → Codex → configurações', async ({ page }) => {
    const errors = collectErrors(page);

    // 1–4. Usuário novo, nível, dificuldades e avaliação.
    await completeOnboarding(page);

    // 5. Central de missões com conteúdo real.
    await page.goto('./#/missoes');
    await page.getByRole('tab', { name: /Disponíveis/ }).click();
    await expect(page.locator('.mission-row').first()).toBeVisible();

    // 6. Inicia um desafio.
    await page.goto(`./#/missao/${MISSION}`);
    await expect(page.getByRole('heading', { name: 'Primeiro contato' })).toBeVisible();
    await page.getByRole('link', { name: /Iniciar missão/ }).click();
    await expect(page.locator('.step-head h1')).toBeVisible();

    // 7. Erra e recebe retorno: classificação com tudo no primeiro grupo.
    const items = page.locator('.classify-item');
    for (let i = 0; i < (await items.count()); i++) await items.nth(i).locator('.bucket-btn').first().click();
    await page.getByRole('button', { name: /Verificar grupos/ }).click();
    await expect(page.getByText('Ainda não')).toBeVisible();
    await expect(page.locator('.feedback .callout.warn', { hasText: 'Pista' })).toBeVisible();
    await expect(page.locator('.classify-item.is-wrong').first()).toBeVisible();

    // 8–9. Responde corretamente e conclui todas as etapas.
    await solveCurrentStep(page);
    const total = await page.locator('.step-track li').count();
    for (let step = 1; step < total; step++) {
      await page.getByRole('button', { name: /^Continuar/ }).click();
      await solveCurrentStep(page);
    }
    await page.getByRole('button', { name: /Ver resultado/ }).click();

    // 10. Recebe a recompensa esperada e o registro é confirmado.
    await expect(page.locator('.results-head .eyebrow')).toHaveText('Missão concluída');
    const xpText = await page.locator('.xp-total').innerText();
    const xp = Number(xpText.replace(/\D/g, ''));
    expect(xp).toBeGreaterThan(0);
    await expect(page.getByText('Progresso salvo neste navegador.')).toBeVisible();

    // 11. Perfil mostra o progresso.
    await page.goto('./#/perfil');
    await expect(page.locator('.history-list')).toContainText('Primeiro contato');
    const xpBefore = await page.locator('.rank').innerText();

    // 12–13. Recarrega e recupera o progresso.
    await page.reload();
    await expect(page.locator('.history-list')).toContainText('Primeiro contato');
    expect(await page.locator('.rank').innerText()).toBe(xpBefore);
    await page.goto('./#/missoes');
    await page.getByRole('tab', { name: /Concluídas/ }).click();
    await expect(page.locator('.mission-row', { hasText: 'Primeiro contato' })).toBeVisible();

    // Repetir logo em seguida não duplica a recompensa.
    await page.goto(`./#/missao/${MISSION}/jogar`);
    for (let step = 0; step < total; step++) {
      await solveCurrentStep(page);
      await page.getByRole('button', { name: step < total - 1 ? /^Continuar/ : /Ver resultado/ }).click();
    }
    await expect(page.locator('.xp-total')).toHaveText('+0 XP');

    // 14. Codex.
    await page.goto('./#/codex/phishing');
    await expect(page.getByRole('heading', { name: 'Phishing', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Erros comuns' })).toBeVisible();

    // 15. Configurações com efeito real e persistente.
    await page.goto('./#/config');
    await page.getByRole('radiogroup', { name: 'Tema' }).getByText('Alto contraste').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'contraste');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'contraste');

    expect(errors).toEqual([]);
  });
});

test.describe('publicação e navegação', () => {
  test('acesso direto sem # num subcaminho cai na rota certa', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('./codex');
    await expect(page).toHaveURL(/#\/codex$/);
    await expect(page.getByRole('heading', { name: 'Codex', level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('assets carregam no caminho-base e sem erros', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    await page.goto('./');
    await expect(page.getByRole('link', { name: /Começar jornada/ })).toBeVisible();
    expect(failed).toEqual([]);
  });

  test('rotas protegidas levam o jogador novo à configuração inicial', async ({ page }) => {
    await page.goto('./#/missoes');
    await expect(page).toHaveURL(/#\/inicio$/);
  });

  test('navegação por teclado no início', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('link', { name: /Começar jornada/ })).toBeVisible();
    let focusedText = '';
    for (let i = 0; i < 12 && !/Começar jornada/.test(focusedText); i++) {
      await page.keyboard.press('Tab');
      focusedText = await page.evaluate(() => document.activeElement?.textContent ?? '');
    }
    expect(focusedText).toMatch(/Começar jornada/);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/inicio$/);
  });

  test('sem rolagem horizontal na tela inicial', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('link', { name: /Começar jornada/ })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
