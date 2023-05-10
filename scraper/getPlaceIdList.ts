import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../costants';
import * as dotenv from 'dotenv';
import fs, { promises } from 'fs';
import { rangeJson } from './utils';
dotenv.config();

interface getPlaceIdListType {
  customRangeFrom?: number;
  customRangeTo?: number;
  customList?: boolean;
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getPlaceIdList = async ({
  customRangeFrom,
  customRangeTo,
  customList = false,
}: getPlaceIdListType = {}): Promise<number[]> => {
  const range = await rangeJson('read');

  let range_from = customRangeFrom || range.from;
  let range_to = customRangeTo || range.to;

  try {
    if (customList) {
      const placeList = await JSON.parse(await promises.readFile('queueList.json', 'utf-8'));
      return placeList;
    } else {
      let { data: places, error } = await supabase
        .from('places')
        .select('place_id')
        .order('place_id', { ascending: true })
        .range(Number(range_from) || 0, Number(range_to) || 0);

      if (customRangeFrom || customRangeTo) console.log(places);
      error && console.log('supanbase getPlaceIdList error', error);

      let results = [];
      for (const { place_id } of places) {
        results = [...results, place_id];
      }

      fs.writeFile('queueList.json', JSON.stringify(results), (err) => {
        if (err) console.log('fs error ', err);
      });
      return results;
    }
  } catch (error) {
    console.log('getPlaceIdList error', error);
  }
};
