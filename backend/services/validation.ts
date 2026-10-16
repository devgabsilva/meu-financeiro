import { z } from 'zod';
import { AMOUNT_PATTERN, CENTS_PER_REAL, DATE_PATTERN, MAX_DATE, MAX_TEXT_LENGTH, MIN_DATE, MONTH_PATTERN } from './constants';
import type { NewEntry } from '../types/NewEntry';

export function validDate(value: string): boolean {
  if (!DATE_PATTERN.test(value) || value < MIN_DATE || value > MAX_DATE) return false;
  const timestamp = Date.parse(value + 'T12:00:00Z');
  if (!Number.isFinite(timestamp)) return false;
  return new Date(timestamp).toISOString().slice(0, 10) === value;
}

const requiredText = z.string().trim().min(1, 'Preencha este campo.').max(MAX_TEXT_LENGTH, 'Use até 150 caracteres.');
const inputSchema = z.object({
  type: z.enum(['receita', 'despesa'], { message: 'Selecione receita ou despesa.' }),
  description: requiredText,
  category: requiredText,
  amount: z.string().regex(AMOUNT_PATTERN, 'Informe um valor positivo com até duas casas decimais.'),
  date: z.string().refine(validDate, 'Informe uma data válida entre 1900 e 9999.'),
});

export function parseAmount(amount: string): number {
  const [whole, fraction = ''] = amount.replace(',', '.').split('.');
  const cents = Number(whole) * CENTS_PER_REAL + Number(fraction.padEnd(2, '0'));
  if (cents <= 0 || !Number.isSafeInteger(cents)) throw new Error('O valor deve ser maior que zero.');
  return cents;
}

export function validateEntry(value: unknown): NewEntry {
  const parsed = inputSchema.safeParse(value);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const { amount, ...entry } = parsed.data;
  return { ...entry, cents: parseAmount(amount) };
}

export function monthRange(month: string): readonly [string, string] {
  if (!MONTH_PATTERN.test(month)) throw new Error('Selecione um mês válido entre 1900 e 9999.');
  return [month + '-01', month + '-31'];
}
