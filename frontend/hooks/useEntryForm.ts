import type { FormController } from '../types/FormController';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { FormState } from '../types/FormState';
import { createEntry, errorMessage } from '../services/api';
import { focusInvalid, readForm, validateForm } from '../services/form';
const INITIAL: FormState = { saving: false, error: '', success: '', fields: {} };

export function useEntryForm(onSaved: (month: string) => void): FormController {
  const [state, setState] = useState(INITIAL);
  const inFlight = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const input = readForm(form);
    const fields = validateForm(input);
    if (Object.keys(fields).length) {
      setState({ ...INITIAL, fields });
      return focusInvalid(form, fields);
    }
    inFlight.current = true;
    setState({ ...INITIAL, saving: true });
    try {
      await createEntry(input);
      form.reset();
      onSaved(input.date.slice(0, 7));
      setState({ ...INITIAL, success: 'Lançamento salvo com sucesso.' });
    } catch (error) {
      setState({ ...INITIAL, error: errorMessage(error) });
    } finally {
      inFlight.current = false;
    }
  }
  return { state, submit };
}
