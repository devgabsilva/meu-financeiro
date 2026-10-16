import { useHydrated } from '../hooks/useHydrated';
import { ArrowRight, Plus } from 'lucide-react';
import { useEntryForm } from '../hooks/useEntryForm';
import { FormFields } from './FormFields';
import { Notice } from './Notice';
import type { EntryFormProps } from '../types/EntryFormProps';

export function EntryForm({ onSaved }: EntryFormProps) {
  const { state, submit } = useEntryForm(onSaved);
  const hydrated = useHydrated();
  return (
    <section id="novo-lancamento" aria-labelledby="form-title" className="panel scroll-mt-6 p-6 lg:sticky lg:top-6">
      <div className="mb-1 flex items-center justify-between"><h2 id="form-title" className="font-semibold">Novo lançamento</h2>
        <Plus aria-hidden="true" size={18} className="text-muted" /></div>
      <p className="mb-6 text-xs text-muted">Um pequeno registro. Mais tranquilidade.</p>
      <form onSubmit={submit} noValidate aria-busy={state.saving} className="grid gap-4">
        <fieldset disabled={!hydrated || state.saving} aria-label="Dados do lançamento" className="grid min-w-0 gap-4"><FormFields fields={state.fields} /></fieldset>
        <Notice message={state.error} error />
        <Notice message={state.success} />
        <button type="submit" disabled={state.saving || !hydrated} className="mt-1 flex items-center justify-between rounded-xl bg-forest px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#163c2f] disabled:cursor-wait disabled:opacity-60">
          {state.saving ? 'Salvando…' : 'Adicionar lançamento'}<ArrowRight aria-hidden="true" size={17} />
        </button>
        <p className="text-center text-[10px] text-muted">Todos os campos são obrigatórios.</p>
      </form>
    </section>
  );
}
