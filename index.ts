import playwright from 'playwright';
import {
  getTitle,
  getImages,
  getContacts,
  getAddress,
  getUsefulInformation,
  getServices,
  getActivities,
} from './scraping';
import Queue from 'queue-promise';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const queue = new Queue({
  concurrent: 1,
  interval: 1000,
  start: true,
});

async function main(id = '363612') {
  const data = [];
  const browser = await playwright.chromium.launch({
    headless: false, // setting this to true will not run the UI
  });

  const context = await browser.newContext({ storageState: 'storageState.json' });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/lieu/${id}/`, { waitUntil: 'networkidle' });

  queue.enqueue(async () => {
    data.push(await getTitle(page, id));
  });
  queue.enqueue(async () => {
    data.push(await getImages(page, id));
  });
  queue.enqueue(async () => {
    data.push(await getContacts(page, id));
  });
  queue.enqueue(async () => {
    data.push(await getAddress(page, id));
  });

  // PRIVATE AREA
  queue.enqueue(async () => {
    await page.goto(`${BASE_URL}/edition/${id}/`, { waitUntil: 'networkidle' });
  });
  queue.enqueue(() => {
    return getUsefulInformation(page, id);
  });
  queue.enqueue(() => {
    return getServices(page, id);
  });
  queue.enqueue(() => {
    return getActivities(page, id);
  });
  queue.enqueue(async () => {
    await browser.close();
  });
}

main();
