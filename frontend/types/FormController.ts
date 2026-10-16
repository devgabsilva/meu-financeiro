import type { FormEvent } from 'react';
import type { FormState } from './FormState';
export type FormController = { state: FormState; submit: (event: FormEvent<HTMLFormElement>) => Promise<void> };
