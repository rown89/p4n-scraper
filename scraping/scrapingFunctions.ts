import playwright, { Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { updateValuesByPlaceId, updateValuesByPlaceIdType } from './utils';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getTitle = async (page: Page, id: string) => {
  try {
    const headerH1 = await page.locator('.header_4 > h1');
    const plainTitle = await headerH1.allInnerTexts();
    const title = plainTitle?.[0];

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
  } catch (error) {
    console.log(`id: ${id} getTitle error\n`, error);
    return false;
  }
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
  try {
    let email = '';
    let website = '';
    let phone_number = '';

    const core_right = await page.locator('#window_core_right_services > div:nth-child(2) > div > a').all();

    for await (const itemlist of core_right) {
      const href = await itemlist.getAttribute('href');
      const onclick = await itemlist.getAttribute('onclick');

      const plainEmail = href?.includes('mailto:') && href?.replace('mailto:', '');
      const plainWebsite = href !== '#' && !href?.includes('mailto:') && href;
      const plainPhoneNumber = onclick && onclick?.replace("alert('", '')?.replace("');", '');

      if (plainEmail) email = plainEmail;
      if (plainWebsite) website = plainWebsite;
      if (plainPhoneNumber) phone_number = plainPhoneNumber;
    }

    const updateValues = { email, website, phone_number };
    for (let k in updateValues) updateValues[k] == '' && delete updateValues[k];

    const updateValuesArgs: updateValuesByPlaceIdType = {
      id,
      db: 'places',
      updateValues,
      event: 'getContacts',
    };

    await updateValuesByPlaceId(updateValuesArgs);
    return true;
  } catch (error) {
    console.log(`id: ${id} getContacts error\n`, error);
    return false;
  }
};

export const getAddress = async (page: Page, id: string) => {
  try {
    const isContainerTextVisible = await page.locator('#window_footer_navigation_adress').isVisible();

    if (isContainerTextVisible) {
      const containerText = await page.locator('#window_footer_navigation_adress').innerText();

      const plainAddressCountry = await page.locator('span[itemprop=addressCountry]').innerText();

      const address = await page.locator('span[itemprop=streetAddress]').innerText();
      const cap = containerText
        ?.replace(/[^0-9]/g, ' ')
        ?.split(' ')
        .filter((e) => e !== '')
        ?.filter((e) => e?.length === 5)?.[0];
      const city = await page.locator('span[itemprop=addressLocality]').innerText();
      const country =
        plainAddressCountry?.charAt(0) === ' ' ? plainAddressCountry.substring(1) : plainAddressCountry;

      const updateValuesArgs: updateValuesByPlaceIdType = {
        id,
        db: 'places',
        updateValues: { address, cap, city, country },
        event: 'getAddress',
      };

      await updateValuesByPlaceId(updateValuesArgs);
      return true;
    } else return false;
  } catch (error) {
    console.log(`id: ${id} getAddress error\n`, error);
    return false;
  }
};

export const getUsefulInformation = async (page: Page, id: string) => {
  try {
    const activitiesContainer = await page.locator('.tabs').isVisible();

    if (activitiesContainer) {
      const opening_time = await page.locator('[name=date_fermeture]')?.inputValue();
      const height_limit = await page.locator('[name=hauteur_limite]')?.inputValue();
      const parking_cost = await page.locator('[name=prix_stationnement]')?.inputValue();
      const price_of_services = await page.locator('[name=prix_services]')?.inputValue();
      const dump_station = await page.locator('[name=borne]')?.inputValue();
      const park_slots = await page.locator('[name=nb_places]')?.inputValue();

      const updateValues = {
        opening_time,
        height_limit,
        parking_cost,
        price_of_services,
        dump_station,
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
