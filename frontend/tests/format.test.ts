import { expect, it, vi } from 'vitest';
import { displayDate, money, monthLabel, shiftMonth, today } from '../services/format';

it('formata reais com centavos e sinal negativo', () => {
  expect(money(1001).replace(/\s/g, ' ')).toBe('R$ 10,01');
  expect(money(-1)).toContain('0,01');
});

it('preserva datas civis e nomeia o mês em português', () => {
  expect(displayDate('2026-10-15')).toBe('15/10/2026');
  expect(monthLabel('2026-10')).toBe('outubro de 2026');
});

it('usa a data local sem deslocamento UTC', () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 15, 12));
  expect(today()).toBe('2026-10-15');
  vi.useRealTimers();
});

it('navega entre anos e respeita os limites suportados', () => {
  expect(shiftMonth('2026-12', 1)).toBe('2027-01');
  expect(shiftMonth('2026-01', -1)).toBe('2025-12');
  expect(shiftMonth('1900-01', -1)).toBe('1900-01');
  expect(shiftMonth('9999-12', 1)).toBe('9999-12');
});
