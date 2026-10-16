import type { PluginConfig, WorkerConfig } from '@cloudflare/vite-plugin';
import type { UserConfig } from 'vite';
import hosting from '../.openai/hosting.json';
const PLACEHOLDER_DATABASE = '00000000-0000-4000-8000-000000000000';
const PREVIEW_SERVICE = 'sites-connector-preview';
const localBindings: Partial<WorkerConfig> = {
  main: './build/sites-worker.ts', compatibility_flags: ['nodejs_compat'],
  d1_databases: hosting.d1 ? [{ binding: hosting.d1, database_name: 'site-creator-d1', database_id: PLACEHOLDER_DATABASE }] : [],
  r2_buckets: hosting.r2 ? [{ binding: hosting.r2, bucket_name: 'site-creator-r2' }] : [],
};

export function configureEnvironment(): void {
  process.env.CLOUDFLARE_CF_FETCH_ENABLED ??= 'false';
  process.env.WRANGLER_SEND_METRICS ??= 'false';
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.WRANGLER_REGISTRY_PATH ??= '.wrangler/dev-registry';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
}

export function previewServer(managed: boolean): UserConfig['server'] {
  const polling = process.env.CODEX_SANDBOX === 'seatbelt';
  return {
    ...(managed ? { host: '0.0.0.0', allowedHosts: ['terminal.local'] } : {}),
    ...(polling ? { watch: { useFsEvents: false, usePolling: true } } : {}),
  };
}

export function workerOptions(command: string): PluginConfig {
  const serve = command === 'serve';
  return {
    viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
    inspectorPort: false,
    persistState: { path: process.env.FINANCE_LOCAL_STATE || '.wrangler/state' },
    config: {
      ...localBindings,
      ...(serve ? { services: [{ binding: 'CONNECTORS', service: PREVIEW_SERVICE, entrypoint: 'ConnectorPreview' }] } : {}),
    },
    ...(serve ? { auxiliaryWorkers: [{ config: {
      name: PREVIEW_SERVICE, main: './build/connector-preview-worker.mjs', compatibility_date: '2026-05-15',
    } }] } : {}),
  };
}
