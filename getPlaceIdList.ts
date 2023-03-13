import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const placeIdList = async () => {
  let range_from = process.env.RANGE_FROM;
  let range_to = process.env.RANGE_TO;

  try {
    let { data: places, error } = await supabase
      .from('places')
      .select('place_id')
      .order('place_id', { ascending: true })
      .range(Number(range_from), Number(range_to));

    error && console.log('supanbase placeIdList error', error);

    const results = places.map((i) => i.place_id);
    console.log(results);
    return results;
  } catch (error) {
    console.log('placeIdList error', error);
  }
};

export default placeIdList;
