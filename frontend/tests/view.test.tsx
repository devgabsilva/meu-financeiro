import { fillForm } from './formHelpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { FinanceView } from '../views/FinanceView';
import { createEntry, loadMonth } from '../services/api';
import { emptyMonth, populatedMonth } from './fixtures';
vi.mock('../services/api', async (original) => {
  const actual = await original<typeof import('../services/api')>();
  return { ...actual, loadMonth: vi.fn(), createEntry: vi.fn() };
});

beforeEach(() => {
  vi.mocked(loadMonth).mockReset().mockResolvedValue(emptyMonth);
  vi.mocked(createEntry).mockReset().mockResolvedValue(undefined);
});

it('mostra resumo zerado e estado vazio com navegação acessível', async () => {
  render(<FinanceView />);
  expect(await screen.findByText('Seu mês começa por aqui')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Ir para o conteúdo' })).toHaveAttribute('href', '#conteudo');
  expect(screen.getByRole('region', { name: 'Resumo financeiro' })).toHaveTextContent('R$');
});

it('mostra receitas, despesas, datas e saldo do mês', async () => {
  vi.mocked(loadMonth).mockResolvedValue(populatedMonth);
  render(<FinanceView />);
  expect(await screen.findByText('Salário')).toBeVisible();
  expect(screen.getByText('Mercado')).toBeVisible();
  expect(screen.getByText('15/10/2026')).toBeVisible();
  expect(screen.getByRole('article', { name: 'Saldo do mês' })).toHaveTextContent('69,99');
});

it('troca o mês pelos controles e cancela a consulta anterior', async () => {
  const user = userEvent.setup();
  render(<FinanceView />);
  await screen.findByText('Seu mês começa por aqui');
  const signal = vi.mocked(loadMonth).mock.calls[0][1];
  await user.click(screen.getByRole('button', { name: 'Próximo mês' }));
  await waitFor(() => expect(loadMonth).toHaveBeenCalledTimes(2));
  expect(signal.aborted).toBe(true);
  await user.click(screen.getByRole('button', { name: 'Mês anterior' }));
  await waitFor(() => expect(loadMonth).toHaveBeenCalledTimes(3));
});

it('permite tentar novamente após falha de carregamento', async () => {
  vi.mocked(loadMonth).mockRejectedValueOnce(new Error('Falha temporária'));
  const user = userEvent.setup();
  render(<FinanceView />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Falha temporária');
  await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  expect(await screen.findByText('Seu mês começa por aqui')).toBeVisible();
});

it('mantém o estado de carregamento até receber a resposta', () => {
  vi.mocked(loadMonth).mockImplementation(() => new Promise(() => undefined));
  render(<FinanceView />);
  expect(screen.getByRole('status')).toHaveTextContent('Carregando lançamentos');
  expect(screen.getByRole('article', { name: 'Saldo do mês' })).toHaveTextContent('—');
});

it('recarrega o resumo após salvar em outro mês', async () => {
  render(<FinanceView />);
  await screen.findByText('Seu mês começa por aqui');
  await fillForm();
  fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2024-02-29' } });
  await userEvent.click(screen.getByRole('button', { name: /Adicionar lançamento/ }));
  await screen.findByText('Lançamento salvo com sucesso.');
  await waitFor(() => expect(loadMonth).toHaveBeenLastCalledWith('2024-02', expect.any(AbortSignal)));
});

it('altera mês pelo seletor e ignora valor vazio', async () => {
  render(<FinanceView />);
  await screen.findByText('Seu mês começa por aqui');
  const selector = screen.getByLabelText('Mês de referência');
  fireEvent.change(selector, { target: { value: '2024-02' } });
  await waitFor(() => expect(loadMonth).toHaveBeenLastCalledWith('2024-02', expect.any(AbortSignal)));
  fireEvent.change(selector, { target: { value: '' } });
  expect(selector).toHaveValue('2024-02');
});
