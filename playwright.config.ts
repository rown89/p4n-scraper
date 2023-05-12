import { defineConfig } from '@playwright/test';
import path from 'path';
import { baseUrl } from './costants';
require('dotenv').config({ path: path.resolve(__dirname, '/.env') });

export default defineConfig({
  testDir: './scraper/tests',
  name: 'p4n function tests',
  testMatch: ['**/*loggedin.spec.ts'],
  use: {
    headless: false,
    baseURL: baseUrl,
    ignoreHTTPSErrors: true,
    storageState: 'storageState.json',
  },
});
