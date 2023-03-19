import { defineConfig } from '@playwright/test';
import path from 'path';
import { BASE_URL } from './costants';
require('dotenv').config({ path: path.resolve(__dirname, '/.env') });

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  testDir: './scraper/tests',
  name: 'p4n function tests',
  testMatch: ['**/*loggedin.spec.ts'],
  use: {
    headless: false,
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    storageState: 'storageState.json',
  },
});
