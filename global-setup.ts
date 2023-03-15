import { chromium, FullConfig } from '@playwright/test';
import login from './scraping/login';

const username = process.env.P4N_USERNAME ?? '';
const password = process.env.P4N_PASSWORD ?? '';

async function globalSetup(config: FullConfig): Promise<void> {
  const { storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await login(page, username, password);

  await page.context().storageState({
    path: storageState as string,
  });
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
