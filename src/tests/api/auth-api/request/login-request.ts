import { loginApi, type LoginResult } from '../../../../utils/api-helpers/loginApi';
import { getValidUser } from '../../../../utils/ui-helper/dataHelper';
import type { APIRequestContext } from '@playwright/test';

export type { LoginResult };

export async function postLogin(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<LoginResult> {
  return loginApi(request, username, password);
}

export function validLoginPayload() {
  return getValidUser();
}

export function invalidLoginPayload() {
  return { username: 'invalid-user', password: 'invalid-password' };
}
