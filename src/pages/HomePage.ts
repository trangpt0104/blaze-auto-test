import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../common/page/BasePage';

export class HomePage extends BasePage {
  readonly pageUrl = '/';
  readonly logInLinkLocator: Locator;
  readonly cartLinkLocator: Locator;
  readonly productTitleLinksLocator: Locator;
  readonly addToCartLinkLocator: Locator;
  readonly loggedInUserNameLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.logInLinkLocator = page.getByRole('link', { name: 'Log in' });
    this.cartLinkLocator = page.getByRole('link', { name: 'Cart', exact: true });
    this.productTitleLinksLocator = page.locator('.card-title a');
    this.addToCartLinkLocator = page.getByRole('link', { name: 'Add to cart' });
    this.loggedInUserNameLocator = page.locator('#nameofuser');
  }

  // Click Log in to open the modal
  async openLoginModal() {
    await this.logInLinkLocator.click();
  }

  // Go to cart page
  async openCart() {
    await this.cartLinkLocator.click();
  }

  // Click product link by exact name
  async clickProductByName(name: string) {
    await this.page.getByRole('link', { name }).first().click();
  }

  // Get product title text by index (0-based)
  async getProductNameByIndex(index: number): Promise<string> {
    const link = this.productTitleLinksLocator.nth(index);
    await link.waitFor({ state: 'visible' });
    return (await link.textContent())?.trim() ?? '';
  }

  // Find: return first product title containing term, or null
  async findProductName(term: string): Promise<string | null> {
    const termLower = term.toLowerCase();
    const count = await this.productTitleLinksLocator.count();
    for (let i = 0; i < count; i++) {
      const title = (await this.productTitleLinksLocator.nth(i).textContent())?.trim() ?? '';
      if (title.toLowerCase().includes(termLower)) return title;
    }
    return null;
  }

  // Add to cart: first match for term, return product name or null
  async addFirstMatchToCart(term: string): Promise<string | null> {
    const foundName = await this.findProductName(term);
    if (!foundName) return null;
    await this.addProductToCartByName(foundName);
    return foundName;
  }

  // Add to cart by keyword (or first product if empty), return { productName, matchesKeyword } for expect
  async addToCartByKeyword(keyword: string): Promise<{ productName: string | null; matchesKeyword: boolean }> {
    const term = keyword || (await this.getProductNameByIndex(0));
    const productName = await this.addFirstMatchToCart(term);
    if (!productName) return { productName: null, matchesKeyword: false };

    const matchesKeyword = !keyword || productName.toLowerCase().includes(keyword.toLowerCase());
    return { productName, matchesKeyword };
  }

  // Open product by name and click Add to cart
  async addProductToCartByName(name: string) {
    await this.clickProductByName(name);
    await this.addToCartLinkLocator.click();
  }

  // Returns true if logged-in username is visible (waits up to 10s)
  async isLoggedInVisible(): Promise<boolean> {
    try {
      await this.loggedInUserNameLocator.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
