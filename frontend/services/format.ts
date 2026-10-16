import { CENTS_PER_REAL, MAX_MONTH, MIN_MONTH } from './constants';
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export function money(cents: number): string {
  return currency.format(cents / CENTS_PER_REAL);
}

export function today(): string {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

export function monthLabel(month: string): string {
  return monthFormatter.format(new Date(month + '-01T12:00:00Z'));
}

export function shiftMonth(month: string, offset: number): string {
  const value = new Date(month + '-01T12:00:00Z');
  value.setUTCMonth(value.getUTCMonth() + offset);
  const result = value.toISOString().slice(0, 7);
  if (result < MIN_MONTH || result > MAX_MONTH || result.startsWith('+')) return month;
  return result;
}

export function displayDate(value: string): string {
  return value.split('-').reverse().join('/');
}
