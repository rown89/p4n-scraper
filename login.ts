import { Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL;

async function login(page: Page, username: string, password: string): Promise<void> {
  await page.goto(`${BASE_URL}/compte`, { waitUntil: 'networkidle' });
  await page
    .locator('#connexion_btn')
    .click()
    .then(() => {
      page.locator('[name=connexion_uuid]').fill(username);
      page.locator('[name=connexion_pwd]').fill(password);
      page.getByRole('button', { name: 'Login' }).click();
    });
}

export default login;
