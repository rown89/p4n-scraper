import { test, Page, expect } from '@playwright/test';
import { BASE_URL, BASE_LANGUAGE, BASE_PLACE_PAGE_URL } from '../../costants';

let page: Page;
test.describe.configure({ mode: 'serial' });

test.describe('suite', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('runs first', async () => {
    await page.goto(`${BASE_URL}/${BASE_LANGUAGE}/${BASE_PLACE_PAGE_URL}/397089`, {
      waitUntil: 'networkidle',
    });
  });

  test('getTitle', async () => {
    const plainTitle = await page.locator('h1').innerText();
    const title = plainTitle?.replace(/ *\([^)]*\) */g, '')?.substring(0);

    await expect(page.locator('h1')).toBeVisible();
  });

  test('getAddress', async () => {
    const isContainerTextVisible = await page.locator('.place-info-location').isVisible();

    if (isContainerTextVisible) {
      const containerText = await page.locator('.place-info-location > li:nth-child(2) > p').innerText();

      const country = containerText?.split('\n')?.[2]?.substring(1);
    }

    await expect(await page.locator('.place-info-location')).toBeVisible();
  });

  test('getContacts', async () => {
    const actionRows = await page.locator('.place-actions')?.isVisible();

    if (actionRows) {
      let website;
      let phone_number;

      const actionRows = await page
        .locator('.place-actions > .col-3:nth-child(3) > .dropdown:nth-child(1) > ul > li > a')
        .all();

      for await (const action of actionRows) {
        const href = await action.getAttribute('href');
        const isPhone = href?.includes('tel:');

        const plainWebsite = !isPhone && href;
        const plainPhone_number = isPhone && href?.replace('tel:', '');

        if (plainWebsite) website = plainWebsite;
        if (plainPhone_number) phone_number = plainPhone_number;
      }

      expect(website || phone_number).toBeTruthy();
    }
  });

  test('getUsefulInformations', async () => {
    const isInformationsVisible = await page.locator('.place-info-details').isVisible();

    if (isInformationsVisible) {
      let height_limit;
      let park_slots;

      const informationTitle = await page.locator('.place-info-details > dt').all();
      const informationValue = await page.locator('.place-info-details > dd').all();

      let titles = [];
      let values = [];

      for await (const key of informationTitle) {
        titles.push(await key.innerText());
      }

      for await (const value of informationValue) {
        values.push(await value.innerText());
      }

      titles.map((title, i) => {
        if (title?.includes('Number of places')) park_slots = values[i];
        if (title?.includes('Limited height')) height_limit = values[i]?.replace('m', '');
      });
    }
    await expect(await page.locator('.place-info-details')).toBeVisible();
  });

  test('getServices', async () => {
    const ServicesContainer = await page.locator('.place-specs-services:nth-child(1)').isVisible();

    if (ServicesContainer) {
      const results = {
        pet_friendly: false,
        drinking_water: false,
        grey_waste_water: false,
        black_waste_water: false,
        trash_can: false,
        public_toilette: false,
        showers: false,
        bakery: false,
        electricity: false,
        wifi: false,
        winter_caravaning: false,
        swimming_pool: false,
        laundry: false,
        mobile_connection: false,
        gpl: false,
        gas: false,
        motorhome_wash: false,
      };

      const services = await page.locator('.place-specs-services > li > img').all();

      for await (const service of services) {
        switch (await service.getAttribute('alt')) {
          case 'Pets Allowed':
            results.pet_friendly = true;
            break;
          case 'Drinking water':
            results.drinking_water = true;
            break;
          case 'Black water':
            results.black_waste_water = true;
            break;
          case 'Wastewater':
            results.grey_waste_water = true;
            break;
          case 'Waste container':
            results.trash_can = true;
            break;
          case 'Showers (possible access)':
            results.showers = true;
            break;
          case 'Electricity (access possible)':
            results.electricity = true;
            break;
          case 'Internet access via WiFi':
            results.wifi = true;
            break;
          case 'Swimming pool':
            results.swimming_pool = true;
            break;
          case 'Laundry':
            results.laundry = true;
            break;
          case 'Washing for motorhome':
            results.motorhome_wash = true;
            break;
          case '3G/4G internet':
            results.mobile_connection = true;
            break;
          default:
        }
      }
    }
  });
});
