import { type APIRequestContext, type Page } from '@playwright/test';
import { config } from '../../common/config/env';
import { getValidUser } from '../ui-helper/dataHelper';

// Result of login API call
export type LoginResult = { ok: boolean; status: number; body?: unknown; bodyError?: string };

// API expects password in base64
function toBase64(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64');
}

// POST login, returns status and body (for API specs)
export async function loginApi(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<LoginResult> {
  const base = config.BASE_URL.replace(/\/$/, '');
  const path = config.API_LOGIN_PATH;
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : '/' + path}`;
  const response = await request.post(url, {
    data: { username, password: toBase64(password) },
    headers: { 'Content-Type': 'application/json' },
    failOnStatusCode: false,
  });
  const body = await response.json().catch(() => ({}));
  const status = response.status();
  const bodyError = typeof body === 'object' && body && 'errorMessage' in body ? (body as { errorMessage: string }).errorMessage : undefined;
  const ok = status >= 200 && status < 300 && !bodyError;
  return { ok, status, body, bodyError };
}

// Login via API then open home page (for E2E)
export async function loginViaApi(page: Page): Promise<void> {
  const { username, password } = getValidUser();
  if (!username?.trim() || !password) {
    throw new Error('Login failed: set USERNAME and PASSWORD.');
  }
  const result = await loginApi(page.request, username.trim(), password);
  if (!result.ok) {
    const msg = result.bodyError ?? `HTTP ${result.status}`;
    throw new Error(`Login failed: ${msg}`);
  }
  await page.goto('/');
}
