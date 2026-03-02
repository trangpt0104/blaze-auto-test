import http from 'k6/http';
import { check, group, sleep } from 'k6';
import encoding from 'k6/encoding';

const API_BASE = __ENV.BASE_URL || 'https://api.demoblaze.com';
const LOGIN_PATH = __ENV.API_LOGIN_PATH || '/login';
const USERNAME = __ENV.USERNAME || 'user-auto-test';
const PASSWORD = __ENV.PASSWORD || 'Test12345';

function toBase64(s: string): string {
  return encoding.b64encode(s, 'std');
}

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function (): void {
  group('Login API', () => {
    const base = API_BASE.replace(/\/$/, '');
    const path = LOGIN_PATH.startsWith('/') ? LOGIN_PATH : `/${LOGIN_PATH}`;
    const url = `${base}${path}`;
    const res = http.post(
      url,
      JSON.stringify({ username: USERNAME, password: toBase64(PASSWORD) }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(res, {
      'status 200': (r) => r.status === 200,
      'no errorMessage': (r) => {
        try {
          const b = JSON.parse(r.body as string) as { errorMessage?: string };
          return !b.errorMessage;
        } catch {
          return true;
        }
      },
    });
    sleep(0.5);
  });
}
