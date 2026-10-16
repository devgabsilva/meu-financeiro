import type { EntryInput } from '../types/EntryInput';
import type { FormState } from '../types/FormState';
import { INPUT_AMOUNT_PATTERN, MAX_TEXT_LENGTH } from './constants';

export function readForm(form: HTMLFormElement): EntryInput {
  const data = new FormData(form);
  return {
    type: String(data.get('type') ?? ''), description: String(data.get('description') ?? '').trim(),
    amount: String(data.get('amount') ?? '').trim(), category: String(data.get('category') ?? '').trim(),
    date: String(data.get('date') ?? ''),
  };
}

export function validateForm(input: EntryInput): FormState['fields'] {
  const errors: FormState['fields'] = {};
  if (!input.description) errors.description = 'Informe uma descrição.';
  if (input.description.length > MAX_TEXT_LENGTH) errors.description = 'Use até 150 caracteres.';
  if (!input.category) errors.category = 'Informe uma categoria.';
  if (!INPUT_AMOUNT_PATTERN.test(input.amount) || Number(input.amount.replace(',', '.')) <= 0) {
    errors.amount = 'Informe um valor maior que zero, com até duas casas decimais.';
  }
  if (!input.date) errors.date = 'Informe a data do lançamento.';
  return errors;
}

export function focusInvalid(form: HTMLFormElement, fields: FormState['fields']): void {
  const first = Object.keys(fields)[0];
  const element = form.elements.namedItem(first);
  if (element instanceof HTMLElement) element.focus();
}
