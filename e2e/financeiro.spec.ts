import { expect, test } from '@playwright/test';
import { addEntry } from './form';

test('registra lançamentos, calcula saldo e preserva os dados após recarga', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Mês de referência').fill('2096-04');
  await expect(page.getByText('Seu mês começa por aqui')).toBeVisible();
  await addEntry(page, { type: 'Receita', description: 'Receita de teste', amount: '3000,10', date: '2096-04-01' });
  await expect(page.getByText('Lançamento salvo com sucesso.')).toBeVisible();
  await expect(page.getByRole('article', { name: 'Receitas', exact: true })).toContainText('3.000,10');
  await addEntry(page, { type: 'Despesa', description: 'Despesa de teste', amount: '100,01', date: '2096-04-15' });
  await expect(page.getByRole('article', { name: 'Saldo do mês' })).toContainText('2.900,09');
  await page.reload();
  await expect(page.getByLabel('Lançamentos', { exact: true })).not.toBeVisible();
  await page.getByLabel('Mês de referência').fill('2096-04');
  await expect(page.getByText('Receita de teste')).toBeVisible();
  await expect(page.getByText('Despesa de teste')).toBeVisible();
  await expect(page.getByRole('article', { name: 'Saldo do mês' })).toContainText('2.900,09');
  await page.getByRole('heading', { level: 1 }).click();
  await page.screenshot({ path: '../outputs/financeiro-desktop.png', fullPage: true });
  await page.getByLabel('Mês de referência').fill('2096-03');
  await expect(page.getByText('Seu mês começa por aqui')).toBeVisible();
  await expect(page.getByRole('article', { name: 'Saldo do mês' })).toContainText('0,00');
});

test('valida campos na interface e dados também na API', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
  await expect(page.getByLabel('Descrição', { exact: true })).toBeFocused();
  await expect(page.getByText('Informe uma categoria.')).toBeVisible();
  const response = await request.post('/api/entries', {
    data: { type: 'despesa', description: 'Inválido', category: 'Teste', amount: '-1', date: '2096-05-01' },
  });
  expect(response.status()).toBe(400);
});

test('mantém a tela utilizável no celular e recupera falha de rede', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/entries?*', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Sem conexão');
  await page.unroute('**/api/entries?*');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByText('Seu mês começa por aqui')).toBeVisible();
  await expect(page.getByLabel('Descrição', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: '../outputs/financeiro-mobile.png', fullPage: true });
});
