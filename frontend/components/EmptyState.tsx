import { NotebookPen } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 py-14 text-center">
      <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-[#dce5d2] bg-[#f1f5eb] text-[#718d58]">
        <NotebookPen aria-hidden="true" size={28} strokeWidth={1.4} />
        <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-white bg-[#bed58b]" />
      </div>
      <h3 className="mb-2 text-base font-semibold tracking-tight">Seu mês começa por aqui</h3>
      <p className="max-w-60 text-xs leading-6 text-muted">Nenhum lançamento neste mês. Registre uma receita ou despesa para começar.</p>
      <a href="#novo-lancamento" className="mt-6 border-b border-forest pb-1 text-xs font-semibold text-forest">Adicionar meu primeiro lançamento →</a>
    </div>
  );
}
