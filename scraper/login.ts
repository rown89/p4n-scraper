import { Page } from '@playwright/test';
import { BASE_LANGUAGE, BASE_LOGIN_URL, BASE_URL, password, username } from '../configurations/costants';

async function login(page: Page): Promise<void> {
  console.log('login start');

  try {
    await page.goto(`${BASE_URL}/${BASE_LANGUAGE}/${BASE_LOGIN_URL}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[name=username]').fill(username);
    await page.locator('[name=password]').fill(password);
    await page.getByRole('button').click();
  } catch (error) {
    console.log('login error', error);
  }
}

export default login;
