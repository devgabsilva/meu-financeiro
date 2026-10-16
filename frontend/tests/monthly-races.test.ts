import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useMonthlyData } from '../hooks/useMonthlyData';
import { loadMonth } from '../services/api';
import type { MonthlyData } from '../types/MonthlyData';
import { emptyMonth, populatedMonth } from './fixtures';
vi.mock('../services/api', async (original) => {
  const actual = await original<typeof import('../services/api')>();
  return { ...actual, loadMonth: vi.fn() };
});

it('não sobrescreve o mês atual com uma resposta antiga', async () => {
  const old = Promise.withResolvers<MonthlyData>();
  vi.mocked(loadMonth).mockReset().mockReturnValueOnce(old.promise).mockResolvedValue(emptyMonth);
  const { result, rerender } = renderHook((month) => useMonthlyData(month), { initialProps: '2026-10' });
  rerender('2026-11');
  await waitFor(() => expect(result.current.data).toEqual(emptyMonth));
  await act(async () => { old.resolve(populatedMonth); });
  expect(result.current.data).toEqual(emptyMonth);
});

it('ignora falha de uma consulta que já foi cancelada', async () => {
  const old = Promise.withResolvers<MonthlyData>();
  vi.mocked(loadMonth).mockReset().mockReturnValueOnce(old.promise).mockResolvedValue(emptyMonth);
  const { result, rerender } = renderHook((month) => useMonthlyData(month), { initialProps: '2026-10' });
  rerender('2026-11');
  await waitFor(() => expect(result.current.data).toEqual(emptyMonth));
  await act(async () => { old.reject(new Error('Erro antigo')); });
  expect(result.current.error).toBe('');
});
