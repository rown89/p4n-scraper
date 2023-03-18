import { Page } from '@playwright/test';
import { BASE_LANGUAGE, BASE_LOGIN_URL, BASE_URL, password, username } from '../costants';

async function login(page: Page): Promise<void> {
  console.log('Login function start');
  try {
    await page.goto(`${BASE_URL}/${BASE_LANGUAGE}/${BASE_LOGIN_URL}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[id=username]').fill(username);
    await page.locator('[id=password]').fill(password);
    await page
      .locator('form')
      .filter({ hasText: 'Enter your email address or usernamePasswordLogin' })
      .getByRole('button', { name: 'Login' })
      .click();
  } catch (error) {
    console.log('login error', error);
  }
}

export default login;
