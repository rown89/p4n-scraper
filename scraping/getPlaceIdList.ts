import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface getPlaceIdListType {
  customRangeFrom?: number;
  customRangeTo?: number;
}

export const getPlaceIdList = async ({ customRangeFrom, customRangeTo }: getPlaceIdListType = {}): Promise<
  number[]
> => {
  const range: { from: number; to: number } = JSON.parse(await fs.promises.readFile('range.json', 'utf-8'));

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
