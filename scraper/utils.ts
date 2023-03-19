import { SupabaseClient } from '@supabase/supabase-js';
import fs, { promises } from 'fs';
import { Page } from 'playwright';
require('dotenv').config();

export interface getDataFunctionProps {
  supabase: SupabaseClient;
  page: Page;
  id: string;
}

export interface updateValuesByPlaceIdType {
  supabase: SupabaseClient;
  id: string;
  db: string;
  updateValues: Record<string, any>;
  event?: string;
}

export interface updateRangeType {
  to: number;
}

interface rangeType {
  from: number;
  to: number;
}

export const updateValuesByPlaceId = async ({
  supabase,
  id,
  db,
  updateValues,
  event,
}: updateValuesByPlaceIdType) => {
  try {
    const { data, error } = await supabase.from(db).update(updateValues).eq('place_id', id);
    if (error)
      console.log(
        `\n
        updateValuesByPlaceId error: ${JSON.stringify(error)},
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

export const rangeJson = async (action: 'read' | 'write', newFrom?: number, newTo?: number) => {
  if (action === 'read') {
    const currentRange: rangeType = JSON.parse(await promises.readFile('range.json', 'utf-8'));
    return currentRange;
  }
  if (action === 'write' && newFrom && newTo) {
    const newRange: rangeType = { from: newFrom, to: newTo };
    await promises.writeFile('range.json', JSON.stringify(newRange, null, 1));
  }
};

export const updateRange = async (to: number) => {
  try {
    const range = await rangeJson('read');
    await rangeJson('write', range.to + 1, range.to + to);
  } catch (error) {
    console.log('updateRange error', error);
  }
};
