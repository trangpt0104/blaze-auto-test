import { test, expect } from '../../../common/fixtures/base-test';
import { HomePage } from '../../../pages/HomePage';
import { LoginPage } from '../../../pages/LoginPage';
import { SignUpPage } from '../../../pages/SignUpPage';
import { CartPage } from '../../../pages/CartPage';
import { getLoginCartData, getSignupCredentials, getOrderDetails } from '../../../utils/ui-helper/dataHelper';
import { loginViaApi } from '../../../utils/api-helpers/loginApi';

test.describe('Regression Test', () => {
  test('Validate user can sign up and log in successfully', { tag: ['@regression', '@TC-28'] }, async ({ page, log }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const signUpPage = new SignUpPage(page);
    const { username, password } = getSignupCredentials();

    log.step('1. Sign up');
    await signUpPage.openSignUpModal();
    await signUpPage.signUp(username, password);
    await signUpPage.waitUntilClosed();

    log.step('2. Log in');
    await homePage.openLoginModal();
    await loginPage.login(username, password);
    await loginPage.waitUntilClosed();

    log.step('3. Verify logged in');
    expect(await homePage.isLoggedInVisible()).toBe(true);
  });

  test('Validate user can search, add to cart, and complete purchase', { tag: ['@regression', '@TC-29'] }, async ({ page, log }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    log.step('1. Login via API');
    await loginViaApi(page);

    log.step('2. Search and add first match to cart');
    const keyword = getLoginCartData().SEARCH_TERM;
    const { productName, matchesKeyword } = await homePage.addToCartByKeyword(keyword);
    expect(productName).toBeTruthy();
    expect(matchesKeyword).toBe(true);

    log.step('3. Open cart and verify one item');
    await homePage.openCart();
    expect(await cartPage.getCartRowCount()).toBe(1);

    log.step('4. Place order');
    await cartPage.placeOrder(getOrderDetails());

    log.step('5. Verify order confirmation');
    expect(await cartPage.isOrderConfirmationVisible()).toBe(true);
  });
});
