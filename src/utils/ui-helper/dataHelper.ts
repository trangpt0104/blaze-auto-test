import { env } from '../../common/config/env';
import { getDateTime } from '../dateTime';
import { dataRegression } from '../../tests/testData/testData';

function getData() {
  const data = dataRegression[env.REGION];
  if (!data) throw new Error(`No test data for env: ${env.REGION}`);
  return data;
}

function getLoginData() {
  return getData().login;
}

export function getLoginCartData() {
  const data = getData();
  return { ...data.login, ...data.product };
}

export function getSignupCredentials(): { username: string; password: string } {
  const { SIGNUP } = getLoginData();
  return {
    username: `${SIGNUP.USERNAME_PREFIX}_${getDateTime()}`,
    password: SIGNUP.PASSWORD,
  };
}

export function getOrderDetails(): { name: string; country: string; city: string; card: string; month: string; year: string } {
  const order = getData().order;
  return {
    name: order.NAME,
    country: order.COUNTRY,
    city: order.CITY,
    card: order.CARD,
    month: order.MONTH,
    year: order.YEAR,
  };
}

export function getValidUser(): { username: string; password: string } {
  const { LOGIN } = getLoginData();
  return { username: LOGIN.USERNAME, password: LOGIN.PASSWORD };
}
