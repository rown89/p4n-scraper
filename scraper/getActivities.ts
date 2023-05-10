import { getDataFunctionProps, updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

export const getActivities = async ({ supabase, page, id }: getDataFunctionProps) => {
  const results = {
    monuments: false,
    surf_sports: false,
    mountain_bike: false,
    hikes: false,
    climbing: false,
    canoe_kayak: false,
    fishing_spots: false,
    swimming: false,
    point_of_view: false,
    playground: false,
  };

  try {
    const placeSpecs = await page.locator('.place-specs > .container > .row').all();

    for await (const [index, row] of placeSpecs.entries()) {
      const specRow = await row.locator('.col-3 > span')?.allInnerTexts();
      const extractedValue = specRow?.[0]?.replace(/^\d+\s*/, '');

      if (extractedValue === 'activities') {
        if (row.locator('.col > ul').isVisible()) {
          const activities = await row.locator('.col > ul > li > img').all();

          for await (const activity of activities) {
            switch (await activity.getAttribute('alt')) {
              case 'Monuments to visit':
                results.monuments = true;
                break;
              case 'Windsurf/kitesurf (Spot of)':
                results.surf_sports = true;
                break;
              case 'Mountain bike tracks':
                results.mountain_bike = true;
                break;
              case 'Departure of hikes':
                results.hikes = true;
                break;
              case 'Climbing (Sites of)':
                results.climbing = true;
                break;
              case 'Canoe/kayak (Base of)':
                results.canoe_kayak = true;
                break;
              case 'Fishing spots':
                results.fishing_spots = true;
                break;
              case 'Swimming possible':
                results.swimming = true;
                break;
              case 'Point of view':
                results.point_of_view = true;
                break;
              case 'Playground':
                results.playground = true;
              default:
            }
          }
        }

        const updateValuesArgs: updateValuesByPlaceIdType = {
          supabase,
          id,
          db: 'places',
          updateValues: results,
          event: 'getServices',
        };

        await updateValuesByPlaceId(updateValuesArgs);
      }
    }
  } catch (error) {
    console.log(`id: ${id} getActivities error\n`, error);
    return false;
  }
};
