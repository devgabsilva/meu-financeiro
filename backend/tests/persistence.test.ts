// @vitest-environment node
import { getTableColumns } from 'drizzle-orm';
import { entries } from '../../db/schema';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { createEntryRepository } from '../data/entries';
import { d1Adapter, openDatabase } from './databaseFixture';
const valid = { type: 'receita' as const, description: "Salário ' especial", cents: 10001, category: 'Trabalho', date: '2026-10-01' };

it('preserva registros após reabrir o banco', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'finance-test-'));
  const path = join(directory, 'finance.sqlite');
  const database = openDatabase(path);
  try {
    await createEntryRepository(d1Adapter(database)).save(valid);
  } finally {
    database.close();
  }
  const reopened = new DatabaseSync(path);
  try {
    const results = await createEntryRepository(d1Adapter(reopened)).list(['2026-10-01', '2026-10-31']);
    expect(results).toEqual([{ ...valid, id: 1 }]);
  } finally {
    reopened.close();
    rmSync(directory, { recursive: true });
  }
});

it('isola os meses e ordena lançamentos no mesmo dia', async () => {
  const database = openDatabase(':memory:');
  const repo = createEntryRepository(d1Adapter(database));
  try {
    await repo.save(valid);
    await repo.save({ ...valid, description: 'Fim do mês', date: '2026-10-31' });
    await repo.save({ ...valid, description: 'Mais recente', date: '2026-10-31' });
    await repo.save({ ...valid, date: '2026-11-01' });
    expect((await repo.list(['2026-10-01', '2026-10-31'])).map((entry) => entry.id)).toEqual([3, 2, 1]);
    expect(await repo.list(['2026-12-01', '2026-12-31'])).toEqual([]);
  } finally {
    database.close();
  }
});

it('recusa binding ausente', () => {
  expect(() => createEntryRepository(undefined)).toThrow('Banco indisponível');
});

it('mantém esquema e migração com as mesmas colunas', () => {
  const database = openDatabase(':memory:');
  try {
    const columns = database.prepare('PRAGMA table_info(entries)').all().map((column) => column.name);
    expect(columns).toEqual(Object.values(getTableColumns(entries)).map((column) => column.name));
  } finally {
    database.close();
  }
});
