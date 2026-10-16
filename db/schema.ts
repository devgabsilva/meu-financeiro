import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const entries = sqliteTable('entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  description: text('description').notNull(),
  cents: integer('cents').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
});
