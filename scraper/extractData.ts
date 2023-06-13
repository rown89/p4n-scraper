import playwright from 'playwright';
import {
  RESOURCE_EXCLUSIONS,
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
  extractHighestRatingDescription,
} from '../costants';
import {
  getTitle,
  getContacts,
  getAddress,
  getUsefulInformation,
  getServices,
  getActivities,
  getHighRatingDescription,
  parseBoolean,
} from './';

import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../costants';
import { getLowRatingIds } from './getLowRatingIds';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  organization: process.env.OPENAI_API_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const supabase = createClient(supabaseUrl, supabaseKey);

export const extractData = async (id: string) => {
  try {
    const browser = await playwright.chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({
      storageState: 'storageState.json',
      javaScriptEnabled: parseBoolean(process.env.JAVASCRIPT),
    });
    const page = await context.newPage();
    await page.route('**/*', (route) => {
      return RESOURCE_EXCLUSIONS.includes(route.request().resourceType()) ? route.abort() : route.continue();
    });

    await page.goto(`${baseUrl}/${baseLanguage}/${basePlacePageUrl}/${id}`, {
      waitUntil: 'domcontentloaded',
    });

    parseBoolean(extractTitle) && (await getTitle({ supabase, page, id }));
    parseBoolean(extractContacts) && (await getContacts({ supabase, page, id }));
    parseBoolean(extractAddress) && (await getAddress({ supabase, page, id }));
    parseBoolean(extractUsefulInformation) && (await getUsefulInformation({ supabase, page, id }));
    parseBoolean(extractHighestRatingDescription) &&
      (await getHighRatingDescription({ supabase, page, id, openai }));
    parseBoolean(extractServices) && (await getServices({ supabase, page, id }));
    parseBoolean(extractActivities) && (await getActivities({ supabase, page, id }));
    parseBoolean(extractLowerRatingIds) && (await getLowRatingIds(page, id));
    await browser.close();

    return id;
  } catch (error) {
    console.log('extractData error', id, error);
  }
};
