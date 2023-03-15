import playwright from 'playwright';
import {
  getTitle,
  getContacts,
  getAddress,
  getUsefulInformation,
  getServices,
  getActivities,
} from '../scraping';

const BASE_URL = process.env.BASE_URL;

export const extractData = async (id: string) => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({ storageState: 'storageState.json' });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/lieu/${id}/`, { waitUntil: 'networkidle' });
    await getTitle(page, id);
    await getContacts(page, id);
    await getAddress(page, id);
    await page.goto(`${BASE_URL}/edition/${id}/`, { waitUntil: 'networkidle' });
    await getUsefulInformation(page, id);
    await getServices(page, id);
    await getActivities(page, id);
    await browser.close();

    return id;
  } catch (error) {
    return { id, error };
  }
};
