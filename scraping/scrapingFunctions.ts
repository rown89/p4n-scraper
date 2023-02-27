import playwright, { Locator, Page } from "playwright";

export const getTitle = async (page: Page) => {
  const header = await page.locator('.header_4');
  const title = await header.allInnerTexts();
  return title;
};

export const getImages = async (page: Page) => {
  const images = await page.$$eval('#thumbs > li > a', allImages => {
    let data = [];
    allImages.forEach((el) => {
      const image = el.querySelector('img')?.getAttribute('src');
      data.push(image)
    });
    return data;
  });
  return images;
};

export const getContacts = async (page: Page) => {
  const core_right = await page.locator('#window_core_right_services > div:nth-child(2) > div > a').all();

  let allitems = [];
  for await (const itemlist of core_right) {
    const href = await itemlist.getAttribute('href');
    const onclick = await itemlist.getAttribute('onclick');

    const mail = href?.includes('mailto:') && href?.replace('mailto:', "");
    const website = href !== "#" && !href?.includes('mailto:') && href;
    const phoneNumber = onclick && onclick?.replace("alert('", "")?.replace("');", "");

    if (mail) allitems.push({ mail });
    if (website) allitems.push({ website });
    if (phoneNumber) allitems.push({ phoneNumber });
  }

  console.log(allitems);
  return allitems;
};

export const getAddress = async (page: Page) => {
  const streetAddress = await page.locator('span[itemprop=streetAddress]').innerText();
  const cap = await page.locator('#window_footer_navigation_adress').innerText();
  const addressLocality = await page.locator('span[itemprop=addressLocality]').innerText();
  const addressCountry = await page.locator('span[itemprop=addressCountry]').innerText();

  console.log(streetAddress, cap, addressCountry, addressLocality);

  return {};
}

export const getUsefulInformation = async (page: Page) => {
  const openingTime = await page.locator("[name=date_fermeture]")?.inputValue();
  const height_limit = await page.locator("[name=hauteur_limite]")?.inputValue();
  const parking_cost = await page.locator("[name=prix_stationnement]")?.inputValue();
  const price_of_cost = await page.locator("[name=prix_services]")?.inputValue();
  const price_of_services = await page.locator("[name=borne]")?.inputValue();
  const type_of_dump_station = await page.locator("[name=borne]")?.inputValue();
  const number_of_places = await page.locator("[name=nb_places]")?.inputValue();

  const results = { openingTime, height_limit, parking_cost, price_of_cost, price_of_services, type_of_dump_station, number_of_places };
  return results;
};

export const getServices = async (page: Page) => {
  // first radio input stand for true
  const animal = await page.locator("[name=animaux]").first().isChecked();
  const drinking_water = await page.locator("[name=point_eau]").first().isChecked();
  const waste_water = await page.locator("[name=eau_usee]").first().isChecked();
  const black_water = await page.locator("[name=eau_noire]").first().isChecked();
  const waste_container = await page.locator("[name=poubelle]").first().isChecked();
  const public_toilette = await page.locator("[name=wc_public]").first().isChecked();
  const showers = await page.locator("[name=douche]").first().isChecked();
  const bakery = await page.locator("[name=boulangerie]").first().isChecked();
  const electricity = await page.locator("[name=electricite]").first().isChecked();
  const wifi = await page.locator("[name=wifi]").first().isChecked();
  const winter_caravaning = await page.locator("[name=caravaneige]").first().isChecked();
  const swimming_pool = await page.locator("[name=piscine]").first().isChecked();
  const laundry = await page.locator("[name=laverie]").first().isChecked();
  const mobile_connection = await page.locator("[name=donnees_mobile]").first().isChecked();
  const gpl = await page.locator("[name=gpl]").first().isChecked();
  const gas = await page.locator("[name=gaz]").first().isChecked();
  const washing_for_mothorhome = await page.locator("[name=lavage]").first().isChecked();

  const results = {
    animal,
    drinking_water,
    waste_water,
    black_water,
    waste_container,
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
    washing_for_mothorhome,
  };

  return results;
};

export const getActivities = async (page: Page) => {
  // first radio input stand for true
  const monument_to_visit = await page.locator("[name=visites]").first().isChecked();
  const windsurf_kiteserf = await page.locator("[name=windsurf]").first().isChecked();
  const mountain_bike_tracks = await page.locator("[name=vtt]").first().isChecked();
  const departure_of_hikes = await page.locator("[name=rando]").first().isChecked();
  const sites_for_climbing = await page.locator("[name=escalade]").first().isChecked();
  const canoe_kayak = await page.locator("[name=eaux_vives]").first().isChecked();
  const fishing_spots = await page.locator("[name=peche]").first().isChecked();
  const swimming_possible = await page.locator("[name=baignade]").first().isChecked();
  const point_of_view = await page.locator("[name=point_de_vue]").first().isChecked();
  const playground = await page.locator("[name=jeux_enfants]").first().isChecked();

  const results = {
    monument_to_visit,
    windsurf_kiteserf,
    mountain_bike_tracks,
    departure_of_hikes,
    sites_for_climbing,
    canoe_kayak,
    fishing_spots,
    swimming_possible,
    point_of_view,
    playground
  };

  //console.log(results);

  return results;
};