import { useHydrated } from '../hooks/useHydrated';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MAX_MONTH, MIN_MONTH } from '../services/constants';
import { shiftMonth } from '../services/format';
import type { MonthSelectorProps } from '../types/MonthSelectorProps';

export function MonthSelector({ month, onChange }: MonthSelectorProps) {
  const hydrated = useHydrated();
  return (
    <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1.5 shadow-sm">
      <button type="button" aria-label="Mês anterior" disabled={!hydrated || month === MIN_MONTH}
        onClick={() => onChange(shiftMonth(month, -1))} className="rounded-lg p-2 text-muted hover:bg-canvas disabled:opacity-30">
        <ChevronLeft aria-hidden="true" size={17} />
      </button>
      <label className="sr-only" htmlFor="month">Mês de referência</label>
      <input id="month" aria-label="Mês de referência" type="month" disabled={!hydrated} value={month} min={MIN_MONTH} max={MAX_MONTH}
        onChange={(event) => onChange(event.target.value)} className="w-40 border-0 bg-transparent text-sm font-semibold text-ink" />
      <button type="button" aria-label="Próximo mês" disabled={!hydrated || month === MAX_MONTH}
        onClick={() => onChange(shiftMonth(month, 1))} className="rounded-lg p-2 text-muted hover:bg-canvas disabled:opacity-30">
        <ChevronRight aria-hidden="true" size={17} />
      </button>
    </div>
  );
}
