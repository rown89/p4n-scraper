import { Page } from '@playwright/test';
import { baseLanguage, baseLoginUrl, baseUrl, password, username } from '../costants';

async function login(page: Page): Promise<void> {
  try {
    await page.goto(`${baseUrl}/${baseLanguage}/${baseLoginUrl}`, { waitUntil: 'domcontentloaded' });
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
