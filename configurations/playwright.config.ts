import type { PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import { BASE_URL } from './costants';

dotenv.config({ path: __dirname + '../.env' });

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global-setup'),
  projects: [
    {
      name: 'chromium',
      use: {
        headless: true,
        storageState: 'storageState.json',
        baseURL: BASE_URL,
        ignoreHTTPSErrors: true,
      },
    },
  ],
};

export default config;
