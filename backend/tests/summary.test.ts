import { expect, it } from 'vitest';
import { summarize } from '../services/summary';

it('retorna totais zerados para mês vazio', () => {
  expect(summarize([])).toEqual({ receita: 0, despesa: 0, balance: 0 });
});

it('calcula saldo negativo sem arredondamento', () => {
  const entries = [{ type: 'receita' as const, cents: 10 }, { type: 'despesa' as const, cents: 20 }];
  expect(summarize(entries)).toEqual({ receita: 10, despesa: 20, balance: -10 });
});

it('soma dez e vinte centavos exatamente', () => {
  expect(summarize([{ type: 'receita', cents: 10 }, { type: 'receita', cents: 20 }]).balance).toBe(30);
});

it('interrompe o cálculo se o total exceder o limite seguro', () => {
  expect(() => summarize([{ type: 'receita', cents: Number.MAX_SAFE_INTEGER }, { type: 'receita', cents: 1 }])).toThrow('limite seguro');
});
