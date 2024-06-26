import { getDataFunctionProps, updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

export const getServices = async ({ supabase, page, id }: getDataFunctionProps) => {
  const results = {
    pet_friendly: false,
    drinking_water: false,
    grey_waste_water: false,
    black_waste_water: false,
    trash_can: false,
    showers: false,
    bakery: false,
    electricity: false,
    wifi: false,
    winter_caravaning: false,
    swimming_pool: false,
    laundry: false,
    mobile_connection: false,
    gpl: false,
    gas: false,
    motorhome_wash: false,
  };

  try {
    const placeSpecs = await page.locator('.place-specs > .container > .row').all();

    for await (const [index, row] of placeSpecs.entries()) {
      const specRow = await row.locator('.col-3 > span')?.allInnerTexts();
      const extractedValue = specRow?.[0]?.replace(/^\d+\s*/, '');

      if (extractedValue === 'services') {
        if (row.locator('.col > ul').isVisible()) {
          const services = await row.locator('.col > ul > li > img').all();

          for await (const service of services) {
            switch (await service.getAttribute('alt')) {
              case 'Pets allowed':
                results.pet_friendly = true;
                break;
              case 'Drinking water':
                results.drinking_water = true;
                break;
              case 'Bakery':
                results.bakery = true;
                break;
              case 'Black water':
                results.black_waste_water = true;
                break;
              case 'Wastewater':
                results.grey_waste_water = true;
                break;
              case 'Waste container':
                results.trash_can = true;
                break;
              case 'Showers (possible access)':
                results.showers = true;
                break;
              case 'Electricity (access possible)':
                results.electricity = true;
                break;
              case 'Internet access via WiFi':
                results.wifi = true;
                break;
              case 'Swimming pool':
                results.swimming_pool = true;
                break;
              case 'Laundry':
                results.laundry = true;
                break;
              case 'Washing for motorhome':
                results.motorhome_wash = true;
                break;
              case 'Bottled gas services':
                results.gas = true;
              case '3G/4G internet':
                results.mobile_connection = true;
                break;
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
    /* if (services) {
      const services = await page.locator('.place-specs-services:nth-child(1) > li > img').all();

      for await (const service of services) {
        switch (await service.getAttribute('alt')) {
          case 'Pets allowed':
            results.pet_friendly = true;
            break;
          case 'Drinking water':
            results.drinking_water = true;
            break;
          case 'Bakery':
            results.bakery = true;
            break;
          case 'Black water':
            results.black_waste_water = true;
            break;
          case 'Wastewater':
            results.grey_waste_water = true;
            break;
          case 'Waste container':
            results.trash_can = true;
            break;
          case 'Showers (possible access)':
            results.showers = true;
            break;
          case 'Electricity (access possible)':
            results.electricity = true;
            break;
          case 'Internet access via WiFi':
            results.wifi = true;
            break;
          case 'Swimming pool':
            results.swimming_pool = true;
            break;
          case 'Laundry':
            results.laundry = true;
            break;
          case 'Washing for motorhome':
            results.motorhome_wash = true;
            break;
          case 'Bottled gas services':
            results.gas = true;
          case '3G/4G internet':
            results.mobile_connection = true;
            break;
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

    await updateValuesByPlaceId(updateValuesArgs); */
  } catch (error) {
    console.log('getServices error', error);
  }
};
