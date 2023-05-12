import playwright from 'playwright';
import { BASE_LANGUAGE, BASE_PLACE_PAGE_URL, BASE_URL } from '../costants';
import {
  getTitle,
  getContacts,
  getAddress,
  getUsefulInformation,
  getServices,
  getActivities,
  parseBoolean,
} from './';

import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../costants';
import { getLowRatingIds } from './getLowRatingIds';

const supabase = createClient(supabaseUrl, supabaseKey);
const RESOURCE_EXCLUSTIONS = ['image', 'stylesheet', 'media', 'font'];

export const extractData = async (id: string) => {
  try {
    const browser = await playwright.chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({
      storageState: 'storageState.json',
      javaScriptEnabled: parseBoolean(process.env.JAVASCRIPT) ? true : false,
    });
    const page = await context.newPage();
    await page.route('**/*', (route) => {
      return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType()) ? route.abort() : route.continue();
    });

    await page.goto(`${BASE_URL}/${BASE_LANGUAGE}/${BASE_PLACE_PAGE_URL}/${id}`, {
      waitUntil: 'domcontentloaded',
    });

    parseBoolean(process.env.GET_TITLE) && (await getTitle({ supabase, page, id }));
    parseBoolean(process.env.GET_CONTACTS) && (await getContacts({ supabase, page, id }));
    parseBoolean(process.env.GET_ADDRESS) && (await getAddress({ supabase, page, id }));
    parseBoolean(process.env.GET_USEFUL_INFORMATION) && (await getUsefulInformation({ supabase, page, id }));
    parseBoolean(process.env.GET_SERVICES) && (await getServices({ supabase, page, id }));
    parseBoolean(process.env.GET_ACTIVITIES) && (await getActivities({ supabase, page, id }));
    parseBoolean(process.env.GET_LOWER_RATING_IDS) && (await getLowRatingIds(page, id));
    await browser.close();

    return id;
  } catch (error) {
    console.log('extractData error', id, error);
  }
};
