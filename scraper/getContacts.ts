import { getDataFunctionProps, updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

export const getContacts = async ({ supabase, page, id }: getDataFunctionProps) => {
  try {
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

      const updateValues = { website, phone_number };
      for (let k in updateValues) updateValues[k] == '' && delete updateValues[k];

      const updateValuesArgs: updateValuesByPlaceIdType = {
        supabase,
        id,
        db: 'places',
        updateValues,
        event: 'getContacts',
      };

      await updateValuesByPlaceId(updateValuesArgs);

      return true;
    }
  } catch (error) {
    console.log('getContacts error', error);
  }
};
