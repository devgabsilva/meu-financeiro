'use client';
import { Header } from '../components/Header';
import { Intro } from '../components/Intro';
import { FinancialSummary } from '../components/FinancialSummary';
import { EntryForm } from '../components/EntryForm';
import { EntryList } from '../components/EntryList';
import { MonthlyNote } from '../components/MonthlyNote';
import { useMonth } from '../hooks/useMonth';
import { useMonthlyData } from '../hooks/useMonthlyData';

export function FinanceView() {
  const { month, selectMonth } = useMonth();
  const { data, error, loading, reload } = useMonthlyData(month);
  function saved(selected: string): void {
    selectMonth(selected);
    reload();
  }
  return (
    <main className="mx-auto max-w-[1240px] px-5 pb-6 sm:px-9 lg:px-12">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-3">Ir para o conteúdo</a>
      <Header />
      <div id="conteudo"><Intro month={month} onChange={selectMonth} /></div>
      <FinancialSummary data={data} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="order-2 min-w-0 lg:order-1">
          <EntryList data={data} month={month} error={error} loading={loading} onRetry={reload} />
          <MonthlyNote />
        </div>
        <div className="order-1 lg:order-2"><EntryForm onSaved={saved} /></div>
      </div>
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[10px] text-muted">
        <span>Seu dinheiro merece um pouco de atenção. Você merece tranquilidade.</span><span>Feito para simplificar.</span>
      </footer>
    </main>
  );
}
