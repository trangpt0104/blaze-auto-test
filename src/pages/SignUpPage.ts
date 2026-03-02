import { type Locator, type Page } from '@playwright/test';

export class SignUpPage {
  readonly signUpModalLocator: Locator;
  readonly usernameInputLocator: Locator;
  readonly passwordInputLocator: Locator;
  readonly signUpButtonLocator: Locator;
  readonly signUpLinkLocator: Locator;

  constructor(page: Page) {
    this.signUpModalLocator = page.locator('#signInModal').filter({
      has: page.getByRole('heading', { name: 'Sign up' }),
    });
    this.usernameInputLocator = page.locator('#sign-username');
    this.passwordInputLocator = page.locator('#sign-password');
    this.signUpButtonLocator = page.getByRole('button', { name: 'Sign up' });
    this.signUpLinkLocator = page.getByRole('link', { name: 'Sign up' });
  }

  // Click Sign up link to open the modal
  async openSignUpModal() {
    await this.signUpLinkLocator.click();
  }

  // Fill username and password, then click Sign up
  async signUp(username: string, password: string) {
    await this.signUpModalLocator.waitFor({ state: 'visible' });
    await this.usernameInputLocator.fill(username);
    await this.passwordInputLocator.fill(password);
    await this.signUpButtonLocator.click();
  }

  // Wait until signup modal is hidden (up to 5s)
  async waitUntilClosed() {
    await this.signUpModalLocator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }
}
