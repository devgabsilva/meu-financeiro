import type { Entry } from '../types/Entry';
import type { Summary } from '../types/Summary';

export function summarize(entries: Pick<Entry, 'type' | 'cents'>[]): Summary {
  return entries.reduce((summary, entry) => {
    const total = summary[entry.type] + entry.cents;
    if (!Number.isSafeInteger(total)) throw new Error('Total mensal excede o limite seguro.');
    return { ...summary, [entry.type]: total, balance: entry.type === 'receita'
      ? total - summary.despesa : summary.receita - total };
  }, { receita: 0, despesa: 0, balance: 0 });
}
