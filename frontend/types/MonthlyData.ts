import type { Entry } from './Entry';
export type MonthlyData = {
  entries: Entry[];
  summary: { receita: number; despesa: number; balance: number };
};
