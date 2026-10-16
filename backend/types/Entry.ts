export type Entry = {
  id: number;
  type: 'receita' | 'despesa';
  description: string;
  cents: number;
  category: string;
  date: string;
};
