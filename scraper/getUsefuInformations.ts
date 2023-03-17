import { getDataFunctionProps } from './utils';

export const getUsefulInformation = async ({ supabase, page, id }: getDataFunctionProps) => {
  try {
    const isInformationsVisible = await page.locator('.place-info-details').isVisible();

    if (isInformationsVisible) {
      let opening_time;
      let height_limit;
      let parking_cost;
      let price_of_services;
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
        if (title?.includes('Price of services')) price_of_services = values[i];
        if (title?.includes('Number of places')) park_slots = values[i];
        if (title?.includes('Open/Closed')) opening_time = values[i];
        if (title?.includes('Parking cost')) parking_cost = values[i];
        if (title?.includes('Limited height')) height_limit = values[i]?.replace('m', '');
      });

      /*
      const updateValues = {
        opening_time,
        height_limit,
        parking_cost,
        price_of_services,
        park_slots,
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
    */
    }
  } catch (error) {
    console.log('getUsefulInformation error', error);
  }
};
