import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global-setup'),
  use: {
    headless: true,
    storageState: 'storageState.json',
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
  },
};

export default config;
