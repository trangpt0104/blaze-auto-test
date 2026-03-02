import type { DeploymentRegion } from '../../types';

// ENV=dev or staging. Test data from testData.ts
export function getCurrentEnv(): DeploymentRegion {
  return process.env.ENV === 'staging' ? 'staging' : 'dev';
}

export const env = {
  REGION: getCurrentEnv(),
} as const;

// Env var names used by testData and config
export const ENV_KEYS = [
  'BASE_URL', 'TIMEOUT', 'ENV',
  'USERNAME', 'PASSWORD',
  'SIGNUP_USERNAME_PREFIX', 'SIGNUP_PASSWORD',
  'PRODUCT_INDEX', 'PRODUCT_NAME',
  'API_LOGIN_PATH', 'SEARCH_TERM',
  'ORDER_NAME', 'ORDER_COUNTRY', 'ORDER_CITY',
  'ORDER_CARD', 'ORDER_MONTH', 'ORDER_YEAR',
] as const;

const e = (key: string, fallback: string) => process.env[key] ?? fallback;
const eNum = (key: string, fallback: number) =>
  Math.max(0, parseInt(e(key, String(fallback)), 10));

// Runtime config. BASE_URL = API base, browser URL derived in Playwright
export type Config = {
  TIMEOUT: number;
  BASE_URL: string;
  API_LOGIN_PATH: string;
};

export const config: Config = {
  TIMEOUT: eNum('TIMEOUT', 30000),
  BASE_URL: e('BASE_URL', 'https://api.demoblaze.com'),
  API_LOGIN_PATH: e('API_LOGIN_PATH', '/login'),
};
