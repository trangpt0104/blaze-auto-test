import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly loginModalLocator: Locator;
  readonly usernameInputLocator: Locator;
  readonly passwordInputLocator: Locator;
  readonly loginButtonLocator: Locator;

  constructor(page: Page) {
    this.loginModalLocator = page.locator('#logInModal').filter({
      has: page.getByRole('heading', { name: 'Log in' }),
    });
    this.usernameInputLocator = page.locator('#loginusername');
    this.passwordInputLocator = page.locator('#loginpassword');
    this.loginButtonLocator = page.getByRole('button', { name: 'Log in' });
  }

  // Fill username and password, then click Log in
  async login(username: string, password: string) {
    await this.loginModalLocator.waitFor({ state: 'visible' });
    await this.usernameInputLocator.fill(username);
    await this.passwordInputLocator.fill(password);
    await this.loginButtonLocator.click();
  }

  // Wait until login modal is hidden (up to 5s)
  async waitUntilClosed() {
    await this.loginModalLocator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }
}
