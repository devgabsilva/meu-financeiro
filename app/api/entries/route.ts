import { env } from 'cloudflare:workers';
import { createEntryRepository } from '../../../backend/data/entries';
import { listEntries, saveEntry } from '../../../backend/routes/entries';

function repository() {
  return createEntryRepository(env.DB);
}

export async function GET(request: Request): Promise<Response> {
  return listEntries(request, repository);
}

export async function POST(request: Request): Promise<Response> {
  return saveEntry(request, repository);
}
