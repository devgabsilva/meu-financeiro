import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

export function openDatabase(filename: string): DatabaseSync {
  const database = new DatabaseSync(filename);
  database.exec(readFileSync('drizzle/0000_open_tombstone.sql', 'utf8'));
  return database;
}

export function d1Adapter(database: DatabaseSync): D1Database {
  return {
    prepare(query: string) {
      const statement = database.prepare(query);
      return {
        bind(...values: (string | number)[]) {
          return {
            async all() { return { results: statement.all(...values) }; },
            async run() { return statement.run(...values); },
          };
        },
      };
    },
  } as unknown as D1Database;
}
