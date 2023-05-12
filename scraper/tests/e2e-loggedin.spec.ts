import { test, Page, expect } from '@playwright/test';
import { baseUrl, baseLanguage, basePlacePageUrl } from '../../costants';

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
    await page.goto(`${baseUrl}/${baseLanguage}/${basePlacePageUrl}/397089`, {
      waitUntil: 'networkidle',
    });
  });

  test('getTitle', async () => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('getAddress', async () => {
    await expect(await page.locator('.place-info-location > li:nth-child(2) > p')).toBeVisible();
  });

  test('getContacts', async () => {
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
  });

  test('getUsefulInformations', async () => {
    const isInformationsVisible = await page.locator('.place-info-details');
    await expect(await isInformationsVisible).toBeVisible();
  });

  test('getServices', async () => {
    let services;
    const placeSpecs = await page.locator('.place-specs > .container > .row').all();

    for await (const [index, row] of placeSpecs.entries()) {
      const specRow = await row.locator('.col-3 > span')?.allInnerTexts();
      const extractedValue = specRow?.[0]?.replace(/^\d+\s*/, '');

      if (extractedValue === 'services') {
        if (row.locator('.col > ul').isVisible()) {
          services = row.locator('.col > ul');
        }
      }
    }

    await expect(await services).toBeVisible();
  });

  test('getActivities', async () => {
    let activities;
    const placeSpecs = await page.locator('.place-specs > .container > .row').all();

    for await (const [index, row] of placeSpecs.entries()) {
      const specRow = await row.locator('.col-3 > span')?.allInnerTexts();
      const extractedValue = specRow?.[0]?.replace(/^\d+\s*/, '');

      if (extractedValue === 'activities') {
        if (row.locator('.col > ul').isVisible()) {
          activities = row.locator('.col > ul');
        }
      }
    }

    await expect(await activities).toBeVisible();
  });
});
