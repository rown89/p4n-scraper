import { updateValuesByPlaceIdType, updateValuesByPlaceId, getDataFunctionProps } from './utils';

export const getTitle = async ({ supabase, page, id }: getDataFunctionProps) => {
  try {
    const plainTitle = await page.locator('h1').innerText();
    const title = plainTitle?.replace(/ *\([^)]*\) */g, '')?.substring(0);
    if (title) {
      const updateValuesArgs: updateValuesByPlaceIdType = {
        supabase,
        id,
        db: 'places',
        updateValues: { title },
        event: 'getTitle',
      };
      await updateValuesByPlaceId(updateValuesArgs);
      return true;
    }
  } catch (error) {
    console.log('getTitle error', error);
  }
};
