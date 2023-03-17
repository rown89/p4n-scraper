import { chromium, FullConfig } from '@playwright/test';
import login from '../scraper/login';

async function globalSetup(config: FullConfig): Promise<void> {
  const { storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await login(page);

  await page.context().storageState({
    path: storageState as string,
  });
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
