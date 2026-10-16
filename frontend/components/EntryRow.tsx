import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { displayDate, money } from '../services/format';
import type { EntryRowProps } from '../types/EntryRowProps';

export function EntryRow({ entry }: EntryRowProps) {
  const income = entry.type === 'receita';
  const Icon = income ? ArrowUpRight : ArrowDownLeft;
  return (
    <li className="flex items-center gap-3 border-b border-line px-5 py-5 last:border-0 sm:px-6">
      <span className={'flex size-10 shrink-0 items-center justify-center rounded-xl ' +
        (income ? 'bg-[#eef4e8] text-[#426a32]' : 'bg-[#fbf0e9] text-[#a26246]')}>
        <Icon aria-hidden="true" size={19} />
      </span>
      <div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{entry.description}</p>
        <p className="mt-1 break-words text-[11px] text-muted">{entry.category} · {income ? 'Receita' : 'Despesa'}</p></div>
      <div className="shrink-0 text-right"><p className={'text-sm font-semibold tabular-nums ' + (income ? 'text-[#426a32]' : 'text-[#985439]')}>
        {income ? '+' : '−'} {money(entry.cents)}</p><time dateTime={entry.date} className="mt-1 block text-[10px] text-muted">{displayDate(entry.date)}</time></div>
    </li>
  );
}
