import { ArrowUpRight, Diamond, Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-24 items-center justify-between border-b border-line max-sm:h-20">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-forest text-[#d8edbd]">
          <Diamond aria-hidden="true" size={23} />
        </span>
        <div><p className="text-lg font-bold tracking-tight">meu financeiro<span className="text-[#779064]">.</span></p>
          <p className="text-[10px] tracking-[0.13em] text-muted">SIMPLES. DO SEU JEITO.</p></div>
      </div>
      <div className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-muted sm:flex">
        <Leaf aria-hidden="true" size={14} /> Um hábito que faz bem
      </div>
      <a href="#novo-lancamento" className="flex items-center gap-2 text-xs font-semibold text-forest sm:hidden">
        Novo lançamento <ArrowUpRight aria-hidden="true" size={16} />
      </a>
    </header>
  );
}
