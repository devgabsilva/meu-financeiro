import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { money } from '../services/format';
import type { SummaryCardProps } from '../types/SummaryCardProps';
const labels = { receita: 'Receitas', despesa: 'Despesas', balance: 'Saldo do mês' };
const icons = { receita: ArrowUpRight, despesa: ArrowDownLeft, balance: Wallet };

export function SummaryCard({ kind, value }: SummaryCardProps) {
  const balance = kind === 'balance';
  const Icon = icons[kind];
  const surface = balance ? 'border-forest bg-forest text-white' : 'border-line bg-white';
  const detail = balance ? 'text-[#d6e5d9]' : 'text-muted';
  return (
    <article aria-label={labels[kind]} className={'min-w-0 rounded-2xl border p-6 ' + surface}>
      <div className={'flex items-center justify-between text-sm ' + detail}>
        <h2>{labels[kind]}</h2><Icon aria-hidden="true" size={19} strokeWidth={1.6} />
      </div>
      <p className="mt-5 break-words text-[clamp(1.125rem,2.3vw,1.875rem)] font-semibold tracking-[-1px] tabular-nums" aria-live="polite">
        {value === null ? '—' : money(value)}
      </p>
      <p className={'mt-2 text-[11px] ' + detail}>{balance ? 'O que fica: receitas menos despesas' : 'Total no mês selecionado'}</p>
    </article>
  );
}
