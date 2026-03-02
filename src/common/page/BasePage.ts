import type { Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  abstract readonly pageUrl: string;

  constructor(page: Page) {
    this.page = page;
  }
}
