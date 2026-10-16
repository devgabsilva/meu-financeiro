import { CATEGORIES } from '../services/constants';
import { today } from '../services/format';
import { Field } from './Field';
import { TypeSelector } from './TypeSelector';
import type { FormFieldsProps } from '../types/FormFieldsProps';

export function FormFields({ fields }: FormFieldsProps) {
  return (
    <>
      <TypeSelector />
      <Field name="description" label="Descrição" placeholder="Ex.: Compras do mercado" error={fields.description} />
      <div className="grid grid-cols-2 gap-3">
        <Field name="amount" label="Valor (R$)" placeholder="0,00" error={fields.amount} />
        <Field name="date" label="Data" type="date" defaultValue={today()} error={fields.date} />
      </div>
      <Field name="category" label="Categoria" placeholder="Selecione ou digite" error={fields.category} />
      <datalist id="categories">{CATEGORIES.map((category) => <option key={category} value={category} />)}</datalist>
    </>
  );
}
