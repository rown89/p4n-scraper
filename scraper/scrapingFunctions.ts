import playwright, { Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';
import { supabaseKey, supabaseUrl } from '../configurations/costants';

const supabase = createClient(supabaseUrl, supabaseKey);

export const getTitle = async (page: Page, id: string) => {
  const headerH1 = await page.locator('h1')?.isVisible();
  if (headerH1) {
    try {
      const headerH1 = await page.locator('h1');

      const plainTitle = await headerH1.innerText();
      const title = plainTitle?.replace(/ *\([^)]*\) */g, '')?.substring(0);

      /*
      const updateValuesArgs: updateValuesByPlaceIdType = {
        id,
        db: 'places',
        updateValues: { title },
        event: 'getTitle',
      };
  
      if (title) {
        await updateValuesByPlaceId(updateValuesArgs);
        return true;
      }
      */
    } catch (error) {
      console.log(`id: ${id} getTitle error\n`, error);
      return false;
    }
  }
  return;
};

export const getImages = async (page: Page, id: string) => {
  try {
    const images = await page.$$eval('#thumbs > li > a', (allImages) => {
      let data = [];
      allImages.forEach((el) => {
        const image = el.querySelector('img')?.getAttribute('src');
        data.push(image);
      });
      return data;
    });
    // console.log('\ngetImages\n', images);
    images.map(async (img) => {
      const image = img?.replace('_pt', '_gd');
      const { data, error } = await supabase.from('places_images').insert([{ place_id: id, url: image }]);
      if (error) console.log('error:', error);
      if (data) return true;
    });
  } catch (error) {
    console.log(`id: ${id} getImages error\n`, error);
    return false;
  }
};

export const getContacts = async (page: Page, id: string) => {
  const actionRows = await page.locator('.place-actions')?.isVisible();

  if (actionRows) {
    let website;
    let phone_number;

    try {
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

      /*
        const updateValues = { website, phone_number };
      for (let k in updateValues) updateValues[k] == '' && delete updateValues[k];

      const updateValuesArgs: updateValuesByPlaceIdType = {
        id,
        db: 'places',
        updateValues,
        event: 'getContacts',
      };

      await updateValuesByPlaceId(updateValuesArgs); */
      return true;
    } catch (error) {
      console.log(`id: ${id} getContacts error\n`, error);
      return false;
    }
  }
  return;
};

export const getAddress = async (page: Page, id: string) => {
  try {
    const isContainerTextVisible = await page.locator('.place-info-location').isVisible();

    if (isContainerTextVisible) {
      const containerText = await page.locator('.place-info-location > li:nth-child(2) > p').innerText();
      const address = containerText?.split('\n')?.[0];
      const city = containerText?.split('\n')?.[1].split(' ')[1].replace(',', '');
      const cap = containerText
        ?.split('\n')?.[1]
        ?.replace(/[^0-9]/g, ' ')
        ?.split(' ')
        .filter((e) => e !== '')
        ?.filter((e) => e?.length === 5)?.[0];
      const country = containerText?.split('\n')?.[2]?.substring(1);

      /*
      const updateValuesArgs: updateValuesByPlaceIdType = {
        id,
        db: 'places',
        updateValues: { address, cap, city, country },
        event: 'getAddress',
      };

      await updateValuesByPlaceId(updateValuesArgs); 
      */
      return true;
    } else return false;
  } catch (error) {
    console.log(`id: ${id} getAddress error\n`, error);
    return false;
  }
};

export const getUsefulInformation = async (page: Page, id: string) => {
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
        id,
        db: 'places',
        updateValues,
        event: 'getUsefulInformation',
      };

      await updateValuesByPlaceId(updateValuesArgs);
      */
      return true;
    } else return false;
  } catch (error) {
    console.log(`id: ${id} getUsefulInformation error\n`, error);
    return false;
  }
};

export const getServices = async (page: Page, id: string) => {
  try {
    const activitiesContainer = await page.locator('.tabs').isVisible();

    if (activitiesContainer) {
      // first radio input stand for true
      const pet_friendly = await page.locator('[name=animaux]')?.first()?.isChecked();
      const drinking_water = await page.locator('[name=point_eau]')?.first()?.isChecked();
      const grey_waste_water = await page.locator('[name=eau_usee]')?.first()?.isChecked();
      const black_waste_water = await page.locator('[name=eau_noire]')?.first()?.isChecked();
      const trash_can = await page.locator('[name=poubelle]')?.first()?.isChecked();
      const public_toilette = await page.locator('[name=wc_public]')?.first()?.isChecked();
      const showers = await page.locator('[name=douche]')?.first()?.isChecked();
      const bakery = await page.locator('[name=boulangerie]')?.first()?.isChecked();
      const electricity = await page.locator('[name=electricite]')?.first()?.isChecked();
      const wifi = await page.locator('[name=wifi]')?.first()?.isChecked();
      const winter_caravaning = await page.locator('[name=caravaneige]')?.first()?.isChecked();
      const swimming_pool = await page.locator('[name=piscine]')?.first()?.isChecked();
      const laundry = await page.locator('[name=laverie]')?.first()?.isChecked();
      const mobile_connection = await page.locator('[name=donnees_mobile]')?.first()?.isChecked();
      const gpl = await page.locator('[name=gpl]')?.first()?.isChecked();
      const gas = await page.locator('[name=gaz]')?.first()?.isChecked();
      const motorhome_wash = await page.locator('[name=lavage]')?.first()?.isChecked();

      const results = {
        pet_friendly,
        drinking_water,
        grey_waste_water,
        black_waste_water,
        trash_can,
        public_toilette,
        showers,
        bakery,
        electricity,
        wifi,
        winter_caravaning,
        swimming_pool,
        laundry,
        mobile_connection,
        gpl,
        gas,
        motorhome_wash,
      };

      const updateValuesArgs: updateValuesByPlaceIdType = {
        id,
        db: 'places',
        updateValues: results,
        event: 'getServices',
      };

      await updateValuesByPlaceId(updateValuesArgs);
      return true;
    } else return false;
  } catch (error) {
    console.log(`id: ${id} getServices error\n`, error);
    return false;
  }
};

export const getActivities = async (page: Page, id: string) => {
  try {
    const activitiesContainer = await page.locator('.tabs').isVisible();

    if (activitiesContainer) {
      // first radio input stand for true
      const monuments = await page.locator('[name=visites]').first().isChecked();
      const surf_sports = await page.locator('[name=windsurf]').first().isChecked();
      const mountain_bike = await page.locator('[name=vtt]').first().isChecked();
      const hikes = await page.locator('[name=rando]').first().isChecked();
      const climbing = await page.locator('[name=escalade]').first().isChecked();
      const canoe_kayak = await page.locator('[name=eaux_vives]').first().isChecked();
      const fishing_spots = await page.locator('[name=peche]').first().isChecked();
      const swimming = await page.locator('[name=baignade]').first().isChecked();
      const point_of_view = await page.locator('[name=point_de_vue]').first().isChecked();
      const playground = await page.locator('[name=jeux_enfants]').first().isChecked();

      const results = {
        monuments,
        surf_sports,
        mountain_bike,
        hikes,
        climbing,
        canoe_kayak,
        fishing_spots,
        swimming,
        point_of_view,
        playground,
      };

      const updateValuesArgs: updateValuesByPlaceIdType = {
        id,
        db: 'places',
        updateValues: results,
        event: 'getActivities',
      };

      await updateValuesByPlaceId(updateValuesArgs);
      return true;
    } else return false;
  } catch (error) {
    console.log(`id: ${id} getActivities error\n`, error);
    return false;
  }
};
