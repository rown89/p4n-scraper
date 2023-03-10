import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface updateValuesByPlaceIdType {
  id: string;
  db: string;
  updateValues: Record<string, any>;
  event?: string;
}

export const updateValuesByPlaceId = async ({
  id,
  db,
  updateValues,
  event,
}: updateValuesByPlaceIdType): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from(db).update(updateValues).eq('place_id', id);
    if (error)
      console.log(
        `supabase updateValuesByPlaceId error: ${JSON.stringify(error)},
        \n id: ${id},
        \n updateValue: ${JSON.stringify(updateValues)},
        \n event: ${event}`,
      );
    if (data) {
      console.log('data:', data);
      return true;
    }
  } catch (error) {
    console.log(`\nupdateValuesByPlaceId error`, error);
    return false;
  }
};
