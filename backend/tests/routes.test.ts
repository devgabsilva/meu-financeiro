import { beforeEach, expect, it, vi } from 'vitest';
import { listEntries, saveEntry } from '../routes/entries';
import type { EntryRepository } from '../types/EntryRepository';
const valid = { type: 'receita', description: 'Salário', amount: '10,01', category: 'Trabalho', date: '2026-10-15' };

function repository(): EntryRepository {
  return { list: vi.fn().mockResolvedValue([]), save: vi.fn().mockResolvedValue(undefined) };
}

function post(value: unknown): Request {
  return new Request('https://local/api/entries', { method: 'POST', body: JSON.stringify(value) });
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

it('lista mês vazio e impede cache', async () => {
  const repo = repository();
  const response = await listEntries(new Request('https://local/api/entries?month=2026-10'), () => repo);
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  expect(await response.json()).toEqual({ entries: [], summary: { receita: 0, despesa: 0, balance: 0 } });
  expect(repo.list).toHaveBeenCalledWith(['2026-10-01', '2026-10-31']);
});

it('rejeita mês ausente antes de acessar o banco', async () => {
  const factory = vi.fn(repository);
  expect((await listEntries(new Request('https://local/api/entries'), factory)).status).toBe(400);
  expect(factory).not.toHaveBeenCalled();
});

it('oculta detalhes internos quando a consulta falha', async () => {
  const factory = (): EntryRepository => { throw new Error('segredo-interno'); };
  const response = await listEntries(new Request('https://local/api/entries?month=2026-10'), factory);
  expect(response.status).toBe(500);
  expect(await response.text()).not.toContain('segredo-interno');
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('entries_list_failed'));
});

it('salva entrada validada com status 201', async () => {
  const repo = repository();
  const response = await saveEntry(post(valid), () => repo);
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ ok: true });
  expect(repo.save).toHaveBeenCalledWith({ type: 'receita', description: 'Salário', cents: 1001, category: 'Trabalho', date: '2026-10-15' });
});

it('não persiste um valor inválido', async () => {
  const factory = vi.fn(repository);
  expect((await saveEntry(post({ ...valid, amount: '0' }), factory)).status).toBe(400);
  expect(factory).not.toHaveBeenCalled();
});

it('retorna erro claro para JSON malformado', async () => {
  const request = new Request('https://local/api/entries', { method: 'POST', body: '{' });
  const response = await saveEntry(request, repository);
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'Envie um JSON válido.' });
});

it('trata falha de persistência sem confirmar sucesso', async () => {
  const repo = repository();
  vi.mocked(repo.save).mockRejectedValue(new Error('detalhe-interno'));
  const response = await saveEntry(post(valid), () => repo);
  expect(response.status).toBe(500);
  expect(await response.json()).toEqual({ error: 'Não foi possível salvar. Tente novamente.' });
});
