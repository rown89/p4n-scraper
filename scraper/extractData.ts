import playwright from 'playwright';
import { dirname } from 'path';
import { BASE_LANGUAGE, BASE_PLACE_PAGE_URL, BASE_URL } from '../configurations/costants';
import { getTitle, getContacts, getAddress, getUsefulInformation, getServices, getActivities } from '.';

export const extractData = async (id: string) => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    storageState: require.resolve('../configurations/storageState.json'),
  });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/${BASE_LANGUAGE}/${BASE_PLACE_PAGE_URL}/${id}`, {
      waitUntil: 'domcontentloaded',
    });
    // await getTitle(page, id);
    // await getContacts(page, id);
    // await getAddress(page, id);
    await getUsefulInformation(page, id);
    /*await getServices(page, id);
    await getActivities(page, id);
    await browser.close(); */

    return id;
  } catch (error) {
    console.log('extractData error', id, error);
  }
};
