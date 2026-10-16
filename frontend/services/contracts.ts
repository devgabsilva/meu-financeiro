import { z } from 'zod';
const safeInteger = z.number().int().safe();
const entry = z.object({
  id: safeInteger.positive(), type: z.enum(['receita', 'despesa']),
  description: z.string(), cents: safeInteger.positive(), category: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const monthlySchema = z.object({
  entries: z.array(entry),
  summary: z.object({ receita: safeInteger.nonnegative(), despesa: safeInteger.nonnegative(), balance: safeInteger }),
});
export const errorSchema = z.object({ error: z.string() });
export const savedSchema = z.object({ ok: z.literal(true) });
