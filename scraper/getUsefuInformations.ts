import { getDataFunctionProps, updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

export const getUsefulInformation = async ({ supabase, page, id }: getDataFunctionProps) => {
  try {
    const isInformationsVisible = await page.locator('.place-info-details').isVisible();

    if (isInformationsVisible) {
      let height_limit;

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
        if (title?.includes('Limited height')) height_limit = values[i]?.replace('m', '');
      });

      const updateValues = {
        height_limit,
      };
      for (let k in updateValues) updateValues[k] == '' && delete updateValues[k];

      const updateValuesArgs: updateValuesByPlaceIdType = {
        supabase,
        id,
        db: 'places',
        updateValues,
        event: 'getUsefulInformation',
      };

      await updateValuesByPlaceId(updateValuesArgs);
    }
  } catch (error) {
    console.log('getUsefulInformation error', error);
  }
};
