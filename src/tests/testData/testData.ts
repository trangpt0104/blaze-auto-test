import type { DataByRegion } from '../../types';

const env = (key: string, fallback: string) => process.env[key] ?? fallback;
const envNum = (key: string, fallback: number) =>
  Math.max(0, parseInt(env(key, String(fallback)), 10));

// Shared test data. Dev: defaults for local. Staging: from process.env (CI/staging).
export interface RegressionData {
  login: {
    SIGNUP: { USERNAME_PREFIX: string; PASSWORD: string };
    LOGIN: { USERNAME: string; PASSWORD: string };
  };
  product: {
    PRODUCT: { INDEX: number; NAME: string };
    SEARCH_TERM: string;
  };
  order: {
    NAME: string;
    COUNTRY: string;
    CITY: string;
    CARD: string;
    MONTH: string;
    YEAR: string;
  };
  productSelection: { index: number; name?: string };
}

export const dataRegression: DataByRegion<RegressionData> = {
  dev: {
    login: {
      SIGNUP: { USERNAME_PREFIX: env('SIGNUP_USERNAME_PREFIX', 'user'), PASSWORD: env('SIGNUP_PASSWORD', 'Test12345') },
      LOGIN: { USERNAME: env('USERNAME', 'user-auto-test'), PASSWORD: env('PASSWORD', 'Test12345') },
    },
    product: {
      PRODUCT: { INDEX: envNum('PRODUCT_INDEX', 0), NAME: env('PRODUCT_NAME', '') },
      SEARCH_TERM: env('SEARCH_TERM', ''),
    },
    order: {
      NAME: env('ORDER_NAME', 'Test User'),
      COUNTRY: env('ORDER_COUNTRY', 'Canada'),
      CITY: env('ORDER_CITY', 'Vancouver'),
      CARD: env('ORDER_CARD', '12345678'),
      MONTH: env('ORDER_MONTH', '12'),
      YEAR: env('ORDER_YEAR', '28'),
    },
    productSelection: { index: envNum('PRODUCT_INDEX', 0), name: process.env.PRODUCT_NAME ?? undefined },
  },
  staging: {
    login: {
      SIGNUP: {
        USERNAME_PREFIX: env('SIGNUP_USERNAME_PREFIX', 'user'),
        PASSWORD: env('SIGNUP_PASSWORD', 'Test12345'),
      },
      LOGIN: {
        USERNAME: env('USERNAME', 'user-auto-test'),
        PASSWORD: env('PASSWORD', 'Test12345'),
      },
    },
    product: {
      PRODUCT: { INDEX: envNum('PRODUCT_INDEX', 0), NAME: env('PRODUCT_NAME', '') },
      SEARCH_TERM: env('SEARCH_TERM', ''),
    },
    order: {
      NAME: env('ORDER_NAME', 'Test User'),
      COUNTRY: env('ORDER_COUNTRY', 'Canada'),
      CITY: env('ORDER_CITY', 'Vancouver'),
      CARD: env('ORDER_CARD', '12345678'),
      MONTH: env('ORDER_MONTH', '12'),
      YEAR: env('ORDER_YEAR', '28'),
    },
    productSelection: { index: envNum('PRODUCT_INDEX', 0), name: process.env.PRODUCT_NAME ?? undefined },
  },
};
