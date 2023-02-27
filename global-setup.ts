// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/compte`, { waitUntil: "networkidle" });

  await page.locator('#connexion_btn').click().then(() => {
    page.locator("[name=connexion_uuid]").fill('rown');
    page.locator("[name=connexion_pwd]").fill('6242');

    page.getByRole('button', { name: 'Login' }).click();
  });
  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;