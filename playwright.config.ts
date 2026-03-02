import { defineConfig, devices } from '@playwright/test';

const apiBase = process.env.BASE_URL || 'https://api.demoblaze.com';
const baseURL = (() => {
  try {
    const u = new URL(apiBase);
    u.hostname = u.hostname.replace(/^api\./, 'www.');
    return u.origin;
  } catch {
    return 'https://www.demoblaze.com';
  }
})();
const timeout = Math.max(0, Number(process.env.TIMEOUT) || 30000);
const reportOutputDir = process.env.REPORT_OUTPUT_DIR || 'playwright-report';
const isCI = !!process.env.CI;

// Single browser when set: BROWSER=chromium, otherwise all
const browserEnv = process.env.BROWSER?.toLowerCase();
const projects = (() => {
  const all: ReturnType<typeof defineConfig>['projects'] = [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], browserName: 'firefox' } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], browserName: 'webkit' } },
  ];
  if (browserEnv === 'chromium' || browserEnv === 'firefox' || browserEnv === 'webkit') {
    return all.filter((p) => p.name === browserEnv);
  }
  return all;
})();

const reporters: NonNullable<ReturnType<typeof defineConfig>['reporter']> = [
  ['list'],
  ['html', { open: 'never', outputFolder: reportOutputDir }],
];
if (isCI || process.env.REPORT_JUNIT === '1') {
  reporters.push(['junit', { outputFile: `${reportOutputDir}/junit.xml` }]);
}
if (process.env.REPORT_JSON === '1') {
  reporters.push(['json', { outputFile: `${reportOutputDir}/results.json` }]);
}

export default defineConfig({
  testDir: 'src/tests',
  testIgnore: ['**/k6/**'],
  timeout,
  expect: { timeout: 5000 },
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? (process.env.WORKERS ? Math.max(1, parseInt(process.env.WORKERS, 10)) : 2) : 1,
  fullyParallel: false,
  reporter: reporters,
  use: {
    headless: process.env.HEADLESS !== '0',
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects,
});
