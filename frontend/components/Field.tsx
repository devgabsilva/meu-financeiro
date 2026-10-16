import { MAX_TEXT_LENGTH } from '../services/constants';
import type { FieldProps } from '../types/FieldProps';

export function Field({ name, label, placeholder, error, type = 'text', defaultValue }: FieldProps) {
  const date = type === 'date';
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-2 block text-xs font-semibold text-ink">{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue}
        required maxLength={MAX_TEXT_LENGTH} inputMode={name === 'amount' ? 'decimal' : undefined}
        min={date ? '1900-01-01' : undefined} max={date ? '9999-12-31' : undefined}
        aria-invalid={Boolean(error)} aria-describedby={error ? name + '-error' : undefined}
        list={name === 'category' ? 'categories' : undefined} className="field" />
      {error ? <p id={name + '-error'} className="mt-1.5 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
