import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { 'cloudflare:workers': fileURLToPath(new URL('./backend/tests/cloudflare.ts', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: ['frontend/tests/setup.ts'],
    include: ['backend/tests/**/*.test.ts', 'frontend/tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['backend/**/*.ts', 'frontend/**/*.{ts,tsx}', 'app/page.tsx', 'app/layout.tsx', 'app/api/**/*.ts', 'db/schema.ts'],
      exclude: ['**/tests/**', '**/types/**'],
      reporter: ['text', 'json-summary', 'html'],
      thresholds: {
        lines: 80, functions: 80, branches: 80, statements: 80,
        'backend/**': { lines: 80, functions: 80, branches: 80, statements: 80 },
        'frontend/**': { lines: 80, functions: 80, branches: 80, statements: 80 },
      },
    },
  },
});
