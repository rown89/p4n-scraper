import playwright from 'playwright';
import fs from 'fs';
import colors from 'ansi-colors';
import cliProgress from 'cli-progress';
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

const bar = new cliProgress.SingleBar({
  format:
    'Progress |' + colors.cyan('{bar}') + `| {percentage}% - {value}/{total} Chunks | {duration_formatted}`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

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

    return id;
  } catch (error) {
    return { id, error };
  }
}

const dbSaveQueue = new Queue({
  concurrent: 5,
  interval: 20,
  start: false,
});

const stepper = async () => {
  const placeList = await placeIdList();

  fs.writeFile('lastPlaceList.json', JSON.stringify(placeList), (err) => {
    if (err) {
      console.log('fs error ', err);
    }
  });

  const enqueuePlaceList = async () => {
    try {
      for await (const id of placeList) {
        dbSaveQueue.enqueue([() => main(id)]);
      }
    } catch (error) {
      console.log('enqueuePlaceList error', error);
    }
  };

  enqueuePlaceList().then(() => dbSaveQueue.start());

  dbSaveQueue.on('start', () => bar.start(placeList?.length, 0));
  dbSaveQueue.on('resolve', (data) => {
    bar.increment();
  });
  dbSaveQueue.on('reject', (error) => console.log('reject', error));
  dbSaveQueue.on('end', () => {
    bar.stop();
  });
};

// main('4698');
stepper();
