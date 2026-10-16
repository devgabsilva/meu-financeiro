import { MonthSelector } from './MonthSelector';
import type { IntroProps } from '../types/IntroProps';

export function Intro({ month, onChange }: IntroProps) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-6 pb-8 pt-10 sm:pt-12">
      <div>
        <p className="eyebrow mb-3 flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#769957]" /> SEU ESPAÇO DE CLAREZA</p>
        <h1 className="text-4xl font-semibold tracking-[-1.5px] sm:text-[44px]">Mais leveza.<span className="text-[#748968]"> Mais controle.</span></h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">Um olhar simples para o seu dinheiro, mês a mês.</p>
      </div>
      <MonthSelector month={month} onChange={onChange} />
    </section>
  );
}
