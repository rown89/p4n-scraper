import { getDataFunctionProps, updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

export const getAddress = async ({ supabase, page, id }: getDataFunctionProps) => {
  try {
    const isContainerTextVisible = await page.locator('.place-info-location').isVisible();

    if (isContainerTextVisible) {
      const containerText = await page.locator('.place-info-location > li:nth-child(2) > p').innerText();
      const country = containerText?.split('\n')?.[2]?.substring(1);

      const updateValuesArgs: updateValuesByPlaceIdType = {
        supabase,
        id,
        db: 'places',
        updateValues: { country },
        event: 'getAddress',
      };

      await updateValuesByPlaceId(updateValuesArgs);
    }
  } catch (error) {
    console.log('getAddress error', error);
  }
};
