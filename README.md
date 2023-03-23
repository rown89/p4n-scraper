# Park4Night Scraper

Scaper built on top of the new Park4Night website with Node, Playwright API and Supabase to store place detail pages data.

`enqueuePlaceList()` start `getPlaceIdList()` who will take care of read range.json file and download the requested range of ids from a supabase table called `places`, where I stored all the available place ids of Park4Night, retrieved by a public endpoint: https://www.park4night.com/services/V3/getLieuxLite.php

Write a file called `lastPlacesList.json` with all the ids that will be scanned. Run a for loop of the id list and enqueue the `extractData()` for each id. When the dequeue process end `updateRange()` will run to download the next range of ids who will be scanned.

## Installation

download p4n-scaper repo and launch

```bash
  npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BASE_URL = https://www.park4night.com`

`BASE_PLACE_PAGE_URL = place`

`BASE_LOGIN_URL = auth/login`

`P4N_USERNAME`

`P4N_PASSWORD`

`SUPABASE_KEY`

`SUPABASE_URL`

`UPDATE_RANGE = 5000`

`CONCURRENT = 5`

## Usage

As default you will scan 5000 place detail pages each time you run:

```
npm run start
```
