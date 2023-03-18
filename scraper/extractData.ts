import playwright from 'playwright';
import { BASE_LANGUAGE, BASE_PLACE_PAGE_URL, BASE_URL } from '../costants';
import { getTitle, getContacts, getAddress, getUsefulInformation, getServices, getActivities } from '.';

import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../costants';

const supabase = createClient(supabaseUrl, supabaseKey);

export const extractData = async (id: string) => {
  try {
    const browser = await playwright.chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({
      storageState: 'storageState.json',
    });
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/${BASE_LANGUAGE}/${BASE_PLACE_PAGE_URL}/${id}`, {
      waitUntil: 'domcontentloaded',
    });
    await getTitle({ supabase, page, id });
    await getContacts({ supabase, page, id });
    await getAddress({ supabase, page, id });
    await getUsefulInformation({ supabase, page, id });
    await getServices({ supabase, page, id });
    await getActivities({ supabase, page, id });
    await browser.close();

    return id;
  } catch (error) {
    console.log('extractData error', id, error);
  }
};
