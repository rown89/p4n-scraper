import fs, { promises } from 'fs';
import { Page } from 'playwright';

export const getLowRatingIds = async (page: Page, id: string) => {
  const placeTypeIsVisible = await page.locator('.place-header-access > img').isVisible();
  const ratingContainer = await page.locator('.place-header-sub > .col-auto > .rating').isVisible();

  try {
    if (ratingContainer && placeTypeIsVisible) {
      const placeType = await page.locator('.place-header-access > img').getAttribute('alt');

      if (
        placeType != 'Paying motorhome area' &&
        placeType != 'Camping' &&
        placeType != 'Service area without parking'
      ) {
        const ratingInnerText = await page
          .locator('.place-header-sub > .col-auto > .rating > span')
          .innerText();
        const ratingValue = ratingInnerText.replace('/5', '');

        if (Number(ratingValue) < 2.5) {
          const currentLowRatingIds = JSON.parse(await promises.readFile('lowRatingIds.json', 'utf-8'));

          const result = [...currentLowRatingIds, Number(id)];

          fs.writeFile('lowRatingIds.json', JSON.stringify(result), (err) => {
            if (err) console.log('fs error ', err);
          });
        }
      }
    }
  } catch (error) {
    console.log('getLowRatingIds error', error);
  }
};
