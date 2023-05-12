import playwright from 'playwright';
import {
  RESOURCE_EXCLUSTIONS,
  baseLanguage,
  basePlacePageUrl,
  baseUrl,
  extractActivities,
  extractAddress,
  extractContacts,
  extractLowerRatingIds,
  extractServices,
  extractTitle,
  extractUsefulInformation,
} from '../costants';
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

    await page.goto(`${baseUrl}/${baseLanguage}/${basePlacePageUrl}/${id}`, {
      waitUntil: 'domcontentloaded',
    });

    parseBoolean(extractTitle) && (await getTitle({ supabase, page, id }));
    parseBoolean(extractContacts) && (await getContacts({ supabase, page, id }));
    parseBoolean(extractAddress) && (await getAddress({ supabase, page, id }));
    parseBoolean(extractUsefulInformation) && (await getUsefulInformation({ supabase, page, id }));
    parseBoolean(extractServices) && (await getServices({ supabase, page, id }));
    parseBoolean(extractActivities) && (await getActivities({ supabase, page, id }));
    parseBoolean(extractLowerRatingIds) && (await getLowRatingIds(page, id));
    await browser.close();

    return id;
  } catch (error) {
    console.log('extractData error', id, error);
  }
};
