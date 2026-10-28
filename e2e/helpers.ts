import { expect, type Page } from '@playwright/test';

/** Coleta erros de página e de console durante o teste. */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  return errors;
}

/** Passa pela configuração inicial respondendo a avaliação. */
export async function completeOnboarding(page: Page, level = 'Iniciante', area = 'Teclado, digitação e atalhos') {
  await page.goto('./');
  await page.getByRole('link', { name: /Começar jornada/ }).click();
  await page.getByRole('button', { name: /Iniciar configuração/ }).click();
  await expect(page.getByRole('heading', { name: /Qual nível de experiência/ })).toBeVisible();
  await page.locator('.ob-level', { hasText: level }).click();
  await page.getByRole('button', { name: /^Continuar/ }).click();
  await expect(page.getByRole('heading', { name: /Em quais áreas/ })).toBeVisible();
  await page.getByRole('button', { name: new RegExp(area.split(',')[0]!) }).first().click();
  await page.getByRole('button', { name: /Salvar e continuar/ }).click();
  await page.getByRole('button', { name: /Começar avaliação/ }).click();
  for (let i = 0; i < 6; i++) {
    await page.locator('.ob-card .option:not(.is-locked)').first().click();
    await page.getByRole('button', { name: /^Confirmar/ }).click();
    await expect(page.locator('.ob-card .callout')).toBeVisible();
    await page.getByRole('button', { name: i < 5 ? /Próxima situação/ : /Ver resultado/ }).click();
  }
  await expect(page.getByRole('heading', { name: /Calibragem concluída/ })).toBeVisible();
  await expect(page.getByText(/Escolhas salvas neste navegador/)).toBeVisible();
}

/**
 * Resolve a etapa atual usando apenas o retorno do jogo (sem conhecer as respostas):
 * - escolha única: tenta as alternativas em ordem;
 * - classificação: move para o próximo grupo os itens marcados como errados.
 */
export async function solveCurrentStep(page: Page): Promise<void> {
  const success = page.locator('.feedback .callout.ok');
  const kind = (await page.locator('.step-head .chip').first().innerText()).trim();

  if (kind === 'Escolha') {
    for (let attempt = 0; attempt < 8 && !(await success.isVisible()); attempt++) {
      const option = page.locator('.options .option:not(.is-wrong):not(.is-locked)').first();
      await option.click();
      await page.getByRole('button', { name: /Confirmar resposta/ }).click();
      await page.waitForTimeout(80);
    }
  } else if (kind === 'Classificação') {
    const items = page.locator('.classify-item');
    const count = await items.count();
    const bucketCount = await items.first().locator('.bucket-btn').count();
    const choice: number[] = [];
    // Mantém o que já foi colocado; só preenche os itens ainda sem grupo.
    for (let i = 0; i < count; i++) {
      const pressed = await items
        .nth(i)
        .locator('.bucket-btn')
        .evaluateAll((buttons) => buttons.findIndex((b) => b.getAttribute('aria-pressed') === 'true'));
      choice[i] = pressed >= 0 ? pressed : 0;
      if (pressed < 0) await items.nth(i).locator('.bucket-btn').nth(0).click();
    }
    for (let attempt = 0; attempt < bucketCount + 1 && !(await success.isVisible()); attempt++) {
      // Itens marcados como errados vão para o próximo grupo antes de verificar de novo.
      for (let i = 0; i < count; i++) {
        if (await items.nth(i).evaluate((el) => el.classList.contains('is-wrong'))) {
          choice[i] = (choice[i]! + 1) % bucketCount;
          await items.nth(i).locator('.bucket-btn').nth(choice[i]!).click();
        }
      }
      await page.getByRole('button', { name: /Verificar grupos/ }).click();
      await page.waitForTimeout(80);
    }
  } else {
    throw new Error(`Formato não suportado pelo resolvedor genérico: ${kind}`);
  }
  await expect(success).toBeVisible();
}
