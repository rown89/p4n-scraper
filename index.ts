import playwright from 'playwright';
import fs from 'fs';
import {
  getTitle,
  getContacts,
  getAddress,
  getUsefulInformation,
  getServices,
  getActivities,
} from './scraping';
import placeIdList from './getPlaceIdList';
import Queue from 'queue-promise';
import * as dotenv from 'dotenv';

dotenv.config();
const BASE_URL = process.env.BASE_URL;

async function main(id: string) {
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

    return true;
  } catch (error) {
    return { id, error };
  }
}

const dbSaveQueue = new Queue({
  concurrent: 4,
  interval: 40,
  start: false,
});

const stepper = async () => {
  const placeList = await placeIdList();

  fs.writeFile('lastPlaceList.json', JSON.stringify(placeList), (err) => {
    if (err) {
      console.log('fs error ', err);
    } else console.log('placeList\n', placeList, '\n');
  });

  const enqueuePlaceList = async () => {
    try {
      await placeList.map((id) => {
        dbSaveQueue.enqueue([() => main(id)]);
      });
    } catch (error) {
      console.log('enqueuePlaceList error', error);
    }
  };

  enqueuePlaceList().then(() => dbSaveQueue.start());

  dbSaveQueue.on('resolve', (data) => console.log('resolve', data));
  dbSaveQueue.on('reject', (error) => console.log('reject', error));
  dbSaveQueue.on('end', () => {
    console.log('end\n');
    return;
  });
};

// main('4698');
stepper();
// placeIdList();
