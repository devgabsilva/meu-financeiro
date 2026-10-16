import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { EntryForm } from '../components/EntryForm';
import { createEntry } from '../services/api';
import { fillForm } from './formHelpers';
vi.mock('../services/api', async (original) => {
  const actual = await original<typeof import('../services/api')>();
  return { ...actual, createEntry: vi.fn() };
});

beforeEach(() => {
  vi.mocked(createEntry).mockReset().mockResolvedValue(undefined);
});

it('aponta campos obrigatórios e move foco para o primeiro erro', async () => {
  render(<EntryForm onSaved={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /Adicionar lançamento/ }));
  expect(screen.getByLabelText('Descrição')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Descrição')).toHaveFocus();
  expect(screen.getByText('Informe uma categoria.')).toBeVisible();
  expect(createEntry).not.toHaveBeenCalled();
});

it('salva receita e informa sucesso ao usuário', async () => {
  const onSaved = vi.fn();
  render(<EntryForm onSaved={onSaved} />);
  await fillForm();
  await userEvent.click(screen.getByRole('radio', { name: 'Receita' }));
  await userEvent.click(screen.getByRole('button', { name: /Adicionar lançamento/ }));
  expect(await screen.findByRole('status')).toHaveTextContent('Lançamento salvo com sucesso');
  expect(createEntry).toHaveBeenCalledWith(expect.objectContaining({ type: 'receita', amount: '10,01' }));
  expect(onSaved).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('Descrição')).toHaveValue('');
});

it('preserva dados digitados quando a API falha', async () => {
  vi.mocked(createEntry).mockRejectedValue(new Error('Falha ao salvar'));
  render(<EntryForm onSaved={vi.fn()} />);
  await fillForm();
  await userEvent.click(screen.getByRole('button', { name: /Adicionar lançamento/ }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Falha ao salvar');
  expect(screen.getByLabelText('Descrição')).toHaveValue('Mercado');
});

it('impede envios duplicados durante o salvamento', async () => {
  vi.mocked(createEntry).mockImplementation(() => new Promise(() => undefined));
  render(<EntryForm onSaved={vi.fn()} />);
  await fillForm();
  const form = screen.getByRole('button', { name: /Adicionar lançamento/ }).closest('form');
  if (!form) throw new Error('Formulário ausente');
  fireEvent.submit(form);
  fireEvent.submit(form);
  await waitFor(() => expect(createEntry).toHaveBeenCalledTimes(1));
  expect(screen.getByRole('button', { name: /Salvando/ })).toBeDisabled();
});
