# Park4Night Scraper

Scaper built on top of the new Park4Night website with Node, Playwright API and Supabase to store page details.

Inside the index.ts you will find 3 functions:

- `enqueuePlaceList`
- `extractData` (commented)
- `getPlaceIdList` (commented)

enqueuePlaceList start a queue of 5 concurrent place id page of 5000 place id

## Installation

download p4n-scaper repo and run

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

```
npm run start
```
