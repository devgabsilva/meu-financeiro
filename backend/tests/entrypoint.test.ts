import { beforeEach, expect, it, vi } from 'vitest';
import { GET, POST } from '../../app/api/entries/route';
import { createEntryRepository } from '../data/entries';
vi.mock('../data/entries', () => ({ createEntryRepository: vi.fn() }));

beforeEach(() => {
  vi.mocked(createEntryRepository).mockReturnValue({ list: vi.fn().mockResolvedValue([]), save: vi.fn().mockResolvedValue(undefined) });
});

it('encaminha GET ao adaptador HTTP', async () => {
  const response = await GET(new Request('https://local/api/entries?month=2026-10'));
  expect(response.status).toBe(200);
  expect(createEntryRepository).toHaveBeenCalledWith(undefined);
});

it('encaminha POST ao adaptador HTTP', async () => {
  const input = { type: 'receita', description: 'Salário', amount: '10', category: 'Trabalho', date: '2026-10-15' };
  const response = await POST(new Request('https://local/api/entries', { method: 'POST', body: JSON.stringify(input) }));
  expect(response.status).toBe(201);
});
