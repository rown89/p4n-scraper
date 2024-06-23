# Park4Night Scraper
Note: *This repository is intended only as a study project*<br>

I have built a scraper using Node.js, the Playwright API, and Supabase to store place detail page data from the new Park4Night website.

The enqueuePlaceList() function initiates the getPlaceIdList() function, which reads the range.json file and downloads the requested range of IDs from a Supabase table called places. This table contains all the available place IDs from Park4Night, retrieved from a public endpoint and converted from JSON to SQL rows.

A file named queueList.json will be created, containing a list of IDs to be scanned. The extractData() function will then be enqueued to process each ID. Once the dequeue process is completed, the program will execute the updateRange() function to download the next set of IDs to be scanned.

To retrieve data such as contact information, you need to be logged in. You can set your PHPSESSID in the storageState file or use the login file to dynamically set the session. (Please note that the provided file is currently an example.)


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

Enable only the scrape modules you need or add yours<br> 
*no get images module are currently provided*<br><br>
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
To convert geojson data to Vector Tiles use [Tippecanoe](https://github.com/mapbox/tippecanoe) from MapBox.<br>
Under folder json_to_geojson you will find an index.ts with a `launchConversion` function who can take [json file of places](https://github.com/rown89/p4n-scraper/blob/main/places-example.json) and trasform them to .geojson spatial data with the current proprierties:<br>

```
title,
place_id,
code,
```

