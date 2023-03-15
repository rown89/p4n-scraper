import { createClient } from '@supabase/supabase-js';
import fs, { promises } from 'fs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface updateValuesByPlaceIdType {
  id: string;
  db: string;
  updateValues: Record<string, any>;
  event?: string;
}

export interface updateRangeType {
  to: number;
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
        `\n
        supabase updateValuesByPlaceId error: ${JSON.stringify(error)},
        id: ${id},
        updateValue: ${JSON.stringify(updateValues)},
        event: ${event}\n
        `,
      );
    if (data) return true;
    else return false;
  } catch (error) {
    console.log(`\nupdateValuesByPlaceId error`, error);
    return false;
  }
};

export const updateRange = async (to: number): Promise<void> => {
  try {
    const currentRange: { from: number; to: number } = JSON.parse(
      await promises.readFile('range.json', 'utf-8'),
    );
    const newRange = { from: currentRange.to + 1, to: currentRange.to + to };
    await promises.writeFile('range.json', JSON.stringify(newRange, null, 1));
  } catch (error) {
    console.log('updateRange error', error);
  }
};
