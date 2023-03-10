import playwright from 'playwright';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
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
  interval: 500,
  start: true,
});

const dbSaveQueue = new Queue({
  concurrent: 1,
  interval: 500,
  start: false,
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main(id: string) {
  const browser = await playwright.chromium.launch({
    headless: true,
  });
  const context = await browser.newContext({ storageState: 'storageState.json' });
  const page = await context.newPage();
  const data = [];

  queue.enqueue([
    async () => await page.goto(`${BASE_URL}/lieu/${id}/`, { waitUntil: 'networkidle' }),
    async () => data.push(await getTitle(page, id)),
    async () => data.push(await getImages(page, id)),
    async () => data.push(await getContacts(page, id)),
    async () => data.push(await getAddress(page, id)),
    // PRIVATE AREA
    async () => page.goto(`${BASE_URL}/edition/${id}/`, { waitUntil: 'networkidle' }),
    async () => getUsefulInformation(page, id),
    async () => getServices(page, id),
    async () => getActivities(page, id),
    async () => await browser.close(),
  ]);
}

let range_from = 0;
let range_to = 99;

const stepper = async () => {
  let { data: places, error } = await supabase
    .from('places')
    .select('place_id')
    .order('place_id', { ascending: true })
    .range(range_from, range_to);

  error && console.log('stepper supabase error', error);
  const placeList = places.map((i) => i.place_id);

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

  dbSaveQueue.on('dequeue', () => console.log('dequeue'));
  dbSaveQueue.on('resolve', (data) => data && console.log('resolve', data));
  dbSaveQueue.on('reject', (error) => error && console.log('reject', error));
  dbSaveQueue.on('end', () => console.log('end\n'));
};

//main('381');
stepper();
