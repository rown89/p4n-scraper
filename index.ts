import Queue from 'queue-promise';
import fs from 'fs';
import { extractData, getPlaceIdList, updateRange } from './scraper';
import colors from 'ansi-colors';
import cliProgress from 'cli-progress';
import * as dotenv from 'dotenv';

dotenv.config();

const bar = new cliProgress.SingleBar({
  format:
    'Progress |' + colors.cyan('{bar}') + `| {percentage}% - {value}/{total} Chunks | {duration_formatted}`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

export const enqueuePlaceList = async () => {
  const concurrent = 5;
  const queue = new Queue({
    concurrent,
    interval: 20,
    start: false,
  });

  const placeList = await getPlaceIdList();

  try {
    fs.writeFile('lastPlaceList.json', JSON.stringify(placeList), (err) => {
      if (err) console.log('fs error ', err);
    });
    for await (const id of placeList) {
      queue.enqueue([() => extractData(id?.toString())]);
    }

    queue.start();
    // bar.start(placeList?.length, 0);

    queue.on('start', () => {});
    queue.on('resolve', (data) => {
      bar.increment();
    });
    queue.on('reject', (error) => console.log('reject', error));
    queue.on('end', async () => {
      bar.stop();
      // await updateRange(3000);
    });
  } catch (error) {
    console.log('enqueuePlaceList error', error);
  }
};

// Start queue and follow range.json from and to variables:
// enqueuePlaceList();

// Get specific id only
extractData('124542');

// Get Supabase id's with a custom range
// getPlaceIdList({ customRangeFrom: 60991, customRangeTo: 60991 });
