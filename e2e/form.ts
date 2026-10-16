import type { Page } from '@playwright/test';
type Input = { type: 'Receita' | 'Despesa'; description: string; amount: string; date: string };

export async function addEntry(page: Page, input: Input): Promise<void> {
  await page.getByRole('radio', { name: input.type }).check();
  await page.getByLabel('Descrição', { exact: true }).fill(input.description);
  await page.getByLabel('Valor (R$)', { exact: true }).fill(input.amount);
  await page.getByLabel('Data', { exact: true }).fill(input.date);
  await page.getByLabel('Categoria', { exact: true }).fill('Teste E2E');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
}
