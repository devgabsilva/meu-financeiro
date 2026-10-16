import { Sprout } from 'lucide-react';

export function MonthlyNote() {
  return (
    <aside aria-label="Dica de organização" className="mt-4 flex items-start gap-3 rounded-xl border border-[#e3e7d7] bg-[#edf1e4] p-4">
      <Sprout aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-[#6a8052]" />
      <div><p className="text-xs font-semibold text-[#506440]">Pequenos hábitos, grandes mudanças.</p>
        <p className="mt-1 text-[11px] leading-5 text-[#61734f]">Registrar seus gastos é o primeiro passo para fazer escolhas com mais consciência.</p></div>
    </aside>
  );
}
