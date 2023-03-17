import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../costants';
import * as dotenv from 'dotenv';
import { rangeJson } from './utils';
dotenv.config();

interface getPlaceIdListType {
  customRangeFrom?: number;
  customRangeTo?: number;
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getPlaceIdList = async ({ customRangeFrom, customRangeTo }: getPlaceIdListType = {}): Promise<
  number[]
> => {
  const range = await rangeJson('read');

  let range_from = customRangeFrom || range.from;
  let range_to = customRangeTo || range.to;

  try {
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
    return results;
  } catch (error) {
    console.log('getPlaceIdList error', error);
  }
};
