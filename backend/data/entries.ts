import type { Entry } from '../types/Entry';
import type { EntryRepository } from '../types/EntryRepository';

const SELECT_MONTH = 'SELECT * FROM entries WHERE date >= ? AND date <= ? ORDER BY date DESC, id DESC';
const INSERT_ENTRY = 'INSERT INTO entries (type,description,cents,category,date) VALUES (?,?,?,?,?)';

export function createEntryRepository(database: D1Database | undefined): EntryRepository {
  if (!database) throw new Error('Banco indisponível.');
  return {
    async list(range) {
      const { results } = await database.prepare(SELECT_MONTH).bind(range[0], range[1]).all<Entry>();
      return results;
    },
    async save(entry) {
      await database.prepare(INSERT_ENTRY)
        .bind(entry.type, entry.description, entry.cents, entry.category, entry.date).run();
    },
  };
}
