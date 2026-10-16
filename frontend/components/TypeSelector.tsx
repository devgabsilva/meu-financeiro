import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export function TypeSelector() {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold">Tipo de lançamento</legend>
      <div className="grid grid-cols-2 gap-2">
        <label className="relative cursor-pointer">
          <input type="radio" name="type" value="despesa" defaultChecked className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0" />
          <span className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm text-muted peer-checked:border-[#ad6d55] peer-checked:bg-[#fbf1eb] peer-checked:text-[#884c38] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
            <ArrowDownLeft aria-hidden="true" size={17} /> Despesa
          </span>
        </label>
        <label className="relative cursor-pointer">
          <input type="radio" name="type" value="receita" className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0" />
          <span className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm text-muted peer-checked:border-forest peer-checked:bg-[#edf4e9] peer-checked:text-forest peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
            <ArrowUpRight aria-hidden="true" size={17} /> Receita
          </span>
        </label>
      </div>
    </fieldset>
  );
}
