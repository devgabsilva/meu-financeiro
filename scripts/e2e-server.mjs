import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const state = mkdtempSync(resolve('.sites-runtime/e2e-'));
process.env.FINANCE_LOCAL_STATE = state;
writeFileSync('.sites-runtime/e2e-state-path.txt', state);

function applyMigrations() {
  const migrations = readdirSync('drizzle').filter((name) => name.endsWith('.sql')).sort();
  for (const migration of migrations) {
    const result = spawnSync(process.execPath, [
      '--import', './scripts/sites-env.mjs', 'node_modules/wrangler/bin/wrangler.js',
      'd1', 'execute', 'DB', '--local', '--config', 'dist/server/wrangler.json',
      '--persist-to', state, '--file', 'drizzle/' + migration,
    ], { stdio: 'inherit', timeout: 30000 });
    if (result.status !== 0) throw new Error('Não foi possível preparar o banco isolado de testes.');
  }
}

applyMigrations();
process.argv = [process.execPath, fileURLToPath(new URL('./run-framework.mjs', import.meta.url)), 'dev'];
await import('./run-framework.mjs');
