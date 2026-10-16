import type { NewEntry } from '../types/NewEntry';
import type { RepositoryFactory } from '../types/RepositoryFactory';
import { logger } from '../data/logger';
import { monthRange, validateEntry } from '../services/validation';
import { summarize } from '../services/summary';

const STATUS_BAD_REQUEST = 400;
const STATUS_CREATED = 201;
const STATUS_FAILURE = 500;

function invalid(error: unknown): Response {
  const message = error instanceof Error ? error.message : 'Dados inválidos.';
  return Response.json({ error: message }, { status: STATUS_BAD_REQUEST });
}

export async function listEntries(request: Request, factory: RepositoryFactory): Promise<Response> {
  const month = new URL(request.url).searchParams.get('month') ?? '';
  const parsed = parseMonth(month);
  if (parsed instanceof Response) return parsed;
  try {
    const entries = await factory().list(parsed);
    return Response.json({ entries, summary: summarize(entries) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    logger.error('entries_list_failed');
    return Response.json({ error: 'Não foi possível carregar os lançamentos.' }, { status: STATUS_FAILURE });
  }
}

function parseMonth(month: string): readonly [string, string] | Response {
  try {
    return monthRange(month);
  } catch (error) {
    return invalid(error);
  }
}

export async function saveEntry(request: Request, factory: RepositoryFactory): Promise<Response> {
  const parsed = await parseRequest(request);
  if (parsed instanceof Response) return parsed;
  try {
    await factory().save(parsed);
    return Response.json({ ok: true }, { status: STATUS_CREATED });
  } catch {
    logger.error('entries_save_failed');
    return Response.json({ error: 'Não foi possível salvar. Tente novamente.' }, { status: STATUS_FAILURE });
  }
}

async function parseRequest(request: Request): Promise<NewEntry | Response> {
  try {
    return validateEntry(await request.json());
  } catch (error) {
    if (error instanceof SyntaxError) return invalid(new Error('Envie um JSON válido.'));
    return invalid(error);
  }
}
