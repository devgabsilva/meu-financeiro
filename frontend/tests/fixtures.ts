import type { MonthlyData } from '../types/MonthlyData';
export const emptyMonth: MonthlyData = { entries: [], summary: { receita: 0, despesa: 0, balance: 0 } };
export const populatedMonth: MonthlyData = {
  entries: [
    { id: 1, type: 'receita', description: 'Salário', cents: 10001, category: 'Trabalho', date: '2026-10-01' },
    { id: 2, type: 'despesa', description: 'Mercado', cents: 3002, category: 'Alimentação', date: '2026-10-15' },
  ],
  summary: { receita: 10001, despesa: 3002, balance: 6999 },
};
