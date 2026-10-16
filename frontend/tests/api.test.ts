import { beforeEach, expect, it, vi } from 'vitest';
import { createEntry, errorMessage, loadMonth } from '../services/api';
import { emptyMonth } from './fixtures';
const input = { type: 'receita', description: 'Salário', amount: '10', category: 'Trabalho', date: '2026-10-15' };
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

it('valida a resposta e envia mês codificado com sinal de cancelamento', async () => {
  fetchMock.mockResolvedValue(Response.json(emptyMonth));
  const signal = new AbortController().signal;
  expect(await loadMonth('2026-10', signal)).toEqual(emptyMonth);
  expect(fetchMock).toHaveBeenCalledWith('/api/entries?month=2026-10', { signal, cache: 'no-store' });
});

it('não aceita resposta mensal com valores inválidos', async () => {
  fetchMock.mockResolvedValue(Response.json({ entries: [], summary: { receita: '10' } }));
  await expect(loadMonth('2026-10', new AbortController().signal)).rejects.toThrow('dados inválidos');
});

it('propaga mensagem da API em falha de cadastro', async () => {
  fetchMock.mockResolvedValue(Response.json({ error: 'Valor inválido.' }, { status: 400 }));
  await expect(createEntry(input)).rejects.toThrow('Valor inválido.');
});

it('usa mensagem genérica para erro sem contrato válido', async () => {
  fetchMock.mockResolvedValue(Response.json({ detail: 'interno' }, { status: 500 }));
  await expect(createEntry(input)).rejects.toThrow('Não foi possível concluir');
});

it('confirma o contrato de sucesso do cadastro', async () => {
  fetchMock.mockResolvedValue(Response.json({ ok: true }, { status: 201 }));
  await expect(createEntry(input)).resolves.toBeUndefined();
  expect(fetchMock).toHaveBeenCalledWith('/api/entries', expect.objectContaining({ method: 'POST', body: JSON.stringify(input) }));
});

it('não declara sucesso quando a resposta do cadastro é inválida', async () => {
  fetchMock.mockResolvedValue(Response.json({ ok: false }));
  await expect(createEntry(input)).rejects.toThrow('confirmar o salvamento');
});

it('diferencia falta de conexão, erro conhecido e valor desconhecido', () => {
  expect(errorMessage(new TypeError('fetch failed'))).toContain('Sem conexão');
  expect(errorMessage(new Error('Mensagem'))).toBe('Mensagem');
  expect(errorMessage(null)).toContain('inesperado');
});
