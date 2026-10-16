import { errorSchema, monthlySchema, savedSchema } from './contracts';
import type { EntryInput } from '../types/EntryInput';
import type { MonthlyData } from '../types/MonthlyData';

async function readResponse(response: Response): Promise<unknown> {
  const payload: unknown = await response.json();
  if (response.ok) return payload;
  const parsed = errorSchema.safeParse(payload);
  throw new Error(parsed.success ? parsed.data.error : 'Não foi possível concluir a operação.');
}

export async function loadMonth(month: string, signal: AbortSignal): Promise<MonthlyData> {
  const response = await fetch('/api/entries?month=' + encodeURIComponent(month), { signal, cache: 'no-store' });
  const result = monthlySchema.safeParse(await readResponse(response));
  if (!result.success) throw new Error('O servidor retornou dados inválidos. Tente novamente.');
  return result.data;
}

export async function createEntry(entry: EntryInput): Promise<void> {
  const response = await fetch('/api/entries', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry),
  });
  const result = savedSchema.safeParse(await readResponse(response));
  if (!result.success) throw new Error('Não foi possível confirmar o salvamento. Atualize a lista antes de tentar novamente.');
}

export function errorMessage(error: unknown): string {
  if (error instanceof TypeError) return 'Sem conexão com o servidor. Verifique sua conexão e tente novamente.';
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
