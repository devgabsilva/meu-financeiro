import { ListFilter } from 'lucide-react';
import { monthLabel } from '../services/format';
import { EntryRow } from './EntryRow';
import { EmptyState } from './EmptyState';
import { Notice } from './Notice';
import type { EntryListProps } from '../types/EntryListProps';

export function EntryList({ data, month, error, loading, onRetry }: EntryListProps) {
  return (
    <section aria-labelledby="entries-title" aria-busy={loading} className="panel min-w-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <div><h2 id="entries-title" className="font-semibold">Lançamentos do mês</h2>
          <p className="mt-1 text-xs capitalize text-muted">{monthLabel(month)}</p></div>
        <span className="flex items-center gap-2 rounded-lg bg-canvas px-2.5 py-1.5 text-xs text-muted">
          <ListFilter aria-hidden="true" size={14} />{data?.entries.length ?? '—'} registros
        </span>
      </div>
      {loading ? <p role="status" className="p-12 text-center text-sm text-muted">Carregando lançamentos…</p> : null}
      {error ? <div className="p-6"><Notice message={error} error onRetry={onRetry} /></div> : null}
      {data?.entries.length === 0 ? <EmptyState /> : null}
      {data && data.entries.length > 0 ? <ul aria-label="Lançamentos">{data.entries.map((entry) => <EntryRow key={entry.id} entry={entry} />)}</ul> : null}
    </section>
  );
}
