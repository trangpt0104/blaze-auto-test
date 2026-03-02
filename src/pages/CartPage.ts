import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../common/page/BasePage';

export class CartPage extends BasePage {
  readonly pageUrl = '/cart.html';
  readonly placeOrderButtonLocator: Locator;
  readonly orderModalLocator: Locator;
  readonly nameInputLocator: Locator;
  readonly countryInputLocator: Locator;
  readonly cityInputLocator: Locator;
  readonly cardInputLocator: Locator;
  readonly monthInputLocator: Locator;
  readonly yearInputLocator: Locator;
  readonly purchaseButtonLocator: Locator;
  readonly cartRowsLocator: Locator;
  readonly orderConfirmationTextLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.placeOrderButtonLocator = page.getByRole('button', { name: 'Place Order' });
    this.orderModalLocator = page.locator('#orderModal');
    this.nameInputLocator = page.locator('#name');
    this.countryInputLocator = page.locator('#country');
    this.cityInputLocator = page.locator('#city');
    this.cardInputLocator = page.locator('#card');
    this.monthInputLocator = page.locator('#month');
    this.yearInputLocator = page.locator('#year');
    this.purchaseButtonLocator = page.getByRole('button', { name: 'Purchase' });
    this.cartRowsLocator = page.locator('tbody tr');
    this.orderConfirmationTextLocator = page.getByText('Thank you for your purchase', { exact: false });
  }

  // Fill order form and click Purchase
  async placeOrder(details: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }) {
    await this.placeOrderButtonLocator.click();
    await this.orderModalLocator.waitFor({ state: 'visible' });
    await this.nameInputLocator.fill(details.name);
    await this.countryInputLocator.fill(details.country);
    await this.cityInputLocator.fill(details.city);
    await this.cardInputLocator.fill(details.card);
    await this.monthInputLocator.fill(details.month);
    await this.yearInputLocator.fill(details.year);
    await this.purchaseButtonLocator.click();
  }

  // Wait for message (up to 10s), returns true if visible
  async isOrderConfirmationVisible(): Promise<boolean> {
    try {
      await this.orderConfirmationTextLocator.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  // Number of rows in cart table (waits up to 5s for table to load)
  async getCartRowCount(): Promise<number> {
    await this.cartRowsLocator.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return this.cartRowsLocator.count();
  }
}
