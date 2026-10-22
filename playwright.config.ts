import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['html', { outputFolder: 'reports' }]
  ],

  use: {
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
});