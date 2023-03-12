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
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  concurrent: 6,
  interval: 20,
  start: false,
});

const stepper = async () => {
  let range_from = 5501;
  let range_to = 6000;

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

  dbSaveQueue.on('resolve', (data) => console.log('resolve', data));
  dbSaveQueue.on('reject', (error) => console.log('reject', error));
  dbSaveQueue.on('end', () => {
    console.log('end\n');
  });
};

// main('4698');
stepper();
