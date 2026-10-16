import type { EntryInput } from './EntryInput';
export type FormState = {
  saving: boolean;
  error: string;
  success: string;
  fields: Partial<Record<keyof EntryInput, string>>;
};
