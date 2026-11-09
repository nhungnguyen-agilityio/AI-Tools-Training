// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 20_000,
  expect: { timeout: 3_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  // Chromium only: one project per mock-up, each with its own viewport.
  projects: [
    { name: 'desktop', testMatch: /desktop\.spec\.js/, use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', testMatch: /mobile\.spec\.js/, use: { ...devices['Pixel 5'] } }
  ],
  // Serves the mock-ups (Happy-Creamy/apps) at http://localhost:8080.
  webServer: {
    command: 'npx http-server ../../apps -p 8080 -c-1',
    url: 'http://localhost:8080/Desktop-index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
