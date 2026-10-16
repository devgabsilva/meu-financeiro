import { expect, it, vi } from 'vitest';
import { logger } from '../data/logger';

it('centraliza logs estruturados sem payloads financeiros', () => {
  const info = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  logger.info('ready');
  logger.error('failed');
  expect(info).toHaveBeenCalledWith('{"level":"info","event":"ready"}');
  expect(error).toHaveBeenCalledWith('{"level":"error","event":"failed"}');
});
