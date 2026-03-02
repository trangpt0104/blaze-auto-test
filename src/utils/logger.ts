export interface Logger {
  log: (message: string, level?: string) => void;
  step: (message: string) => void;
  error: (message: string, err: unknown) => void;
}

export const logger: Logger = {
  log: (message: string, level = 'INFO') => {
    const idx = process.env.TEST_PARALLEL_INDEX ?? 'global';
    console.log(`[Worker-${idx}][${level}] ${message}`);
  },
  step: (message: string) => {
    logger.log(message, 'STEP');
  },
  error: (message: string, err: unknown) => {
    console.error(message, err instanceof Error ? err.message : err);
  },
};
