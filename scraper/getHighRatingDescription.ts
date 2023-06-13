import { Configuration, OpenAIApi } from 'openai';
import { getDataFunctionProps, updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

export const getHighRatingDescription = async ({ supabase, page, id, openai }: getDataFunctionProps) => {
  const placeTypeIsVisible = await page.locator('.place-header-access > img').isVisible();
  const ratingContainer = await page.locator('.place-header-sub > .col-auto > .rating').isVisible();
  const engDescriptionContainer = await page.locator('p[lang="en"]').isVisible();

  try {
    if (ratingContainer && placeTypeIsVisible) {
      const ratingInnerText = await page
        .locator('.place-header-sub > .col-auto > .rating > span')
        .innerText();
      const ratingValue = ratingInnerText.replace('/5', '');

      if (Number(ratingValue) > 3.5 && engDescriptionContainer) {
        const engDescriptionContainer = await page.locator('p[lang="en"]');
        const original_description = await engDescriptionContainer.textContent();

        const result = await openai.createCompletion({
          model: 'text-davinci-002',
          prompt: `Rewrite this sentence differently, change synonyms, correct grammar but keep the meaning:\n\"\"\"\n${original_description}`,
          temperature: 1,
          max_tokens: 100,
          stop: ['"""'],
        });

        const description = result.data.choices[0].text.trim();

        if (description.length >= 65) {
          const updateValuesArgs: updateValuesByPlaceIdType = {
            supabase,
            id,
            db: 'places',
            updateValues: { description },
            event: 'getHighRatingDescription',
          };
          await updateValuesByPlaceId(updateValuesArgs);
        }
      }
    }
    return;
  } catch (error) {
    console.log('getHighRatingDescription error', error);
  }
};
