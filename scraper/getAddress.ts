import { getDataFunctionProps, updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

export const getAddress = async ({ supabase, page, id }: getDataFunctionProps) => {
  try {
    const isContainerTextVisible = await page.locator('.place-info-location').isVisible();

    if (isContainerTextVisible) {
      const containerText = await page.locator('.place-info-location > li:nth-child(2) > p').innerText();
      const address = containerText?.split('\n')?.[0];
      const city = containerText?.split('\n')?.[1].split(' ')[1]?.replace(',', '');
      const cap = containerText?.split('\n')?.[1]?.substring(0, 5);
      const country = containerText?.split('\n')?.[2]?.substring(1);

      const updateValuesArgs: updateValuesByPlaceIdType = {
        supabase,
        id,
        db: 'places',
        updateValues: { address, cap, city, country },
        event: 'getAddress',
      };

      await updateValuesByPlaceId(updateValuesArgs);
    }
  } catch (error) {
    console.log('getAddress error', error);
  }
};
