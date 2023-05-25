# Park4Night Scraper

Scaper built on top of the new Park4Night website with NodeJs, Playwright API and Supabase to store place detail pages data.

`enqueuePlaceList()` start `getPlaceIdList()` who take care of read `range.json` file and download the requested range of ids from a Supabase table called `places` where I stored all the available place ids of Park4Night, retrieved from this [public endpoint](https://www.park4night.com/services/V3/getLieuxLite.php) and converted from json to SQL rows.

A file named `queueList.json` will be created, containing a list of IDs to be scanned and `extractData()` function will be enqueued to process each ID.
After the dequeue process is completed, the program will execute the `updateRange()` function to download the next set of IDs that will be scanned.

![Screenshot 2023-03-24 at 01 04 53](https://user-images.githubusercontent.com/44890500/227390807-c81b4eaa-0444-40db-b972-0203bc2ced73.png)

## Installation

Download p4n-scaper repo and launch

```bash
  npm install
```

## Environment Variables

To successfully run this project, please make sure to include the following environment variables in your .env file, see the [env.example](https://github.com/rown89/p4n-scraper/blob/main/env.example) file

`BASE_URL = https://www.park4night.com`<br>
`BASE_PLACE_PAGE_URL = place`<br>
`BASE_LOGIN_URL = auth/login`<br>
`P4N_USERNAME`<br>
`P4N_PASSWORD`<br>
`SUPABASE_KEY`<br>
`SUPABASE_URL`<br>
`UPDATE_RANGE = 5000`<br>
`CONCURRENT = 5`<br>

Disable javascript to scrape fast as hell<br>
`JAVASCRIPT = true`<br>

Enable only the scrape modules you need<br>
`GET_TITLE = true`<br>
`GET_CONTACTS = true`<br>
`GET_ADDRESS = true`<br>
`GET_USEFUL_INFORMATION = true`<br>
`GET_SERVICES = true`<br>
`GET_ACTIVITIES = true`<br>
`GET_LOWER_RATING_IDS = false`<br>

## Usage
```
npm run start
```

# Run Playwright tests
```
npm run test
```

## Optional
To convert geojson data to Vector Tiles use [Tippecanoe](https://github.com/mapbox/tippecanoe) from MapBox.
