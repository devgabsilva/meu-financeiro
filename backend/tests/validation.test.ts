import { describe, expect, it } from 'vitest';
import { monthRange, parseAmount, validDate, validateEntry } from '../services/validation';
const valid = { type: 'receita', description: ' Salário ', amount: '0,10', category: ' Trabalho ', date: '2026-10-15' };

describe('validação de lançamentos', () => {
  it('normaliza textos e preserva centavos exatos', () => {
    expect(validateEntry(valid)).toEqual({ type: 'receita', description: 'Salário', cents: 10, category: 'Trabalho', date: valid.date });
  });
  it.each(['-1', '1.001', 'NaN', '1e2', '', '10000000000', '1,2.3', null, 12])('rejeita valor inválido %s', (amount) => {
    expect(() => validateEntry({ ...valid, amount })).toThrow();
  });
  it('rejeita valor zero', () => {
    expect(() => validateEntry({ ...valid, amount: '0' })).toThrow('maior que zero');
  });
  it.each(['description', 'category', 'type', 'date'])('exige o campo %s', (key) => {
    expect(() => validateEntry({ ...valid, [key]: '' })).toThrow();
  });
  it('rejeita texto que excede o limite', () => {
    expect(() => validateEntry({ ...valid, description: 'x'.repeat(151) })).toThrow('150');
  });
  it.each([null, [], 'texto', undefined])('rejeita entradas não estruturadas', (value) => {
    expect(() => validateEntry(value)).toThrow();
  });
});

describe('datas civis', () => {
  it.each(['2026-02-30', '2026-02-29', '1899-12-31', '99999-01-01', '2026-13-01', '2026-01-99', 'data'])('rejeita %s', (date) => {
    expect(validDate(date)).toBe(false);
  });
  it.each(['2024-02-29', '1900-01-01', '9999-12-31'])('aceita %s', (date) => {
    expect(validDate(date)).toBe(true);
  });
});

describe('intervalo mensal e dinheiro', () => {
  it('seleciona inclusive os limites do mês', () => {
    expect(monthRange('2026-12')).toEqual(['2026-12-01', '2026-12-31']);
  });
  it.each(['2026-13', '2026-00', '2026-1', '1899-12', "2026-10' OR 1=1"])('rejeita mês inválido %s', (month) => {
    expect(() => monthRange(month)).toThrow();
  });
  it.each([['12', 1200], ['0.20', 20], ['12,3', 1230]])('converte %s em centavos', (amount, expected) => {
    expect(parseAmount(String(amount))).toBe(expected);
  });
  it('rejeita overflow monetário', () => {
    expect(() => parseAmount('999999999999999999999999999')).toThrow();
  });
});
