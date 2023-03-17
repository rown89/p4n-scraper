import { defineConfig } from '@playwright/test';
import path from 'path';
import { BASE_URL } from './costants';
import { MyOptions } from './scraper/fixtures';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig<MyOptions>({
  testDir: './scraper',
  projects: [
    {
      name: 'scraper logged in',
      testMatch: ['**/*loggedin.spec.ts'],
      use: {
        headless: false,
        baseURL: BASE_URL,
        ignoreHTTPSErrors: true,
        supabase,
        id: '8',
      },
    },
  ],
});
