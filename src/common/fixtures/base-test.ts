import { test as base } from '@playwright/test';
import { logger } from '../../utils/logger';

export * from '@playwright/test';

export const test = base.extend<{ log: typeof logger }>({
  page: async ({ page }, use) => {
    page.on('dialog', (d) => d.accept());
    await page.goto('/');
    await use(page);
  },
  log: async ({}, use) => {
    await use(logger);
  },
});
