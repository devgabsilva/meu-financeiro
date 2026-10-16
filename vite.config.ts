import vinext from 'vinext';
import { defineConfig } from 'vite';
import { readExecutionProfile } from './scripts/execution-profile.mjs';
import { sites } from './build/sites-vite-plugin';
import { connectorPreview } from './build/connector-preview-plugin.mjs';
import { configureEnvironment, previewServer, workerOptions } from './build/preview-config';

export default defineConfig(async ({ command }) => {
  const managed = readExecutionProfile() === 'managed-linux';
  configureEnvironment();
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  return {
    server: previewServer(managed),
    plugins: [vinext(), sites({ mockAuth: !managed }), connectorPreview(), cloudflare(workerOptions(command))],
  };
});
