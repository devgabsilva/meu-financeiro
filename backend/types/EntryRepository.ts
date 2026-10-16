import type { Entry } from './Entry';
import type { NewEntry } from './NewEntry';
export type EntryRepository = {
  list: (range: readonly [string, string]) => Promise<Entry[]>;
  save: (entry: NewEntry) => Promise<void>;
};
