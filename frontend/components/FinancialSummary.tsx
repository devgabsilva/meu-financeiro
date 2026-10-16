import { SummaryCard } from './SummaryCard';
import type { FinancialSummaryProps } from '../types/FinancialSummaryProps';

export function FinancialSummary({ data }: FinancialSummaryProps) {
  return (
    <section aria-label="Resumo financeiro" className="mb-8 grid gap-4 sm:grid-cols-3">
      <SummaryCard kind="balance" value={data?.summary.balance ?? null} />
      <SummaryCard kind="receita" value={data?.summary.receita ?? null} />
      <SummaryCard kind="despesa" value={data?.summary.despesa ?? null} />
    </section>
  );
}
