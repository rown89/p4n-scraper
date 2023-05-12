import Queue from 'queue-promise';
import { extractData, getPlaceIdList, updateRange } from './scraper';
import colors from 'ansi-colors';
import cliProgress from 'cli-progress';
import * as dotenv from 'dotenv';
import { concurrent, updateRangeValue } from './costants';
dotenv.config();

const bar = new cliProgress.SingleBar({
  format:
    'Progress |' + colors.cyan('{bar}') + `| {percentage}% - {value}/{total} Chunks | {duration_formatted}`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

export const enqueuePlaceList = async ({ customList = false }: { customList?: boolean }) => {
  const queue = new Queue({
    concurrent: Number(concurrent),
    interval: 20,
    start: false,
  });

  try {
    const placeList = await getPlaceIdList({ customList });

    for await (const id of placeList) {
      queue.enqueue([() => extractData(id?.toString())]);
    }

    queue.start();
    bar.start(placeList?.length, 0);

    queue.on('resolve', (data) => {
      bar.increment();
    });
    queue.on('reject', (error) => console.log('reject', error));
    queue.on('end', async () => {
      bar.stop();
      updateRange(customList && placeList.length > 0 ? placeList.length : Number(updateRangeValue));
    });
  } catch (error) {
    console.log('enqueuePlaceList error', error);
  }
};

// default
enqueuePlaceList({});

// Extract specific id only
// extractData('406982');

// Get Supabase id's with a custom range
// getPlaceIdList({ customRangeFrom: 101993, customRangeTo: 101993 });

// Get list directly from queueList.json
// enqueuePlaceList({ customList: true });
