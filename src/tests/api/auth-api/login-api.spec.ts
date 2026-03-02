import { test, expect } from '@playwright/test';
import {
  postLogin,
  validLoginPayload,
  invalidLoginPayload,
} from './request/login-request';

test.describe('Login API', () => {
  test('Validate login with valid credentials returns success', { tag: ['@api, @TC-30'] }, async ({ request }) => {
    const { username, password } = validLoginPayload();
    const result = await postLogin(request, username, password);
    expect(result.status).toBe(200);
    expect(result.ok).toBe(true);
    expect(result.bodyError).toBeUndefined();
  });

  test('Validate login with invalid password returns error', { tag: ['@api, @TC-31'] }, async ({ request }) => {
    const { username, password } = invalidLoginPayload();
    const result = await postLogin(request, username, password);
    expect(result.ok).toBe(false);
    expect(result.bodyError).toBeDefined();
  });
});
