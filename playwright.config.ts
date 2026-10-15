import { defineConfig, devices } from '@playwright/test';

// Browser tests for the main flows. They run against a production build on their own port and in their
// own build folder, with the AI and photo endpoints mocked, so they need no API keys and never touch
// `npm run dev` on port 3000. Uses the Chrome you already have installed (no browser download).
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npx next build --webpack && npx next start -p ${PORT}`,
    env: { NEXT_DIST_DIR: '.next-e2e' },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
