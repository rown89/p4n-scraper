import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

export const baseUrl = process.env.BASE_URL;
export const baseLanguage = process.env.BASE_LANGUAGE;
export const basePlacePageUrl = process.env.BASE_PLACE_PAGE_URL;
export const baseLoginUrl = process.env.BASE_LOGIN_URL;
export const username = process.env.P4N_USERNAME ?? '';
export const password = process.env.P4N_PASSWORD ?? '';
export const supabaseKey = process.env.SUPABASE_KEY;
export const supabaseUrl = process.env.SUPABASE_URL;
export const updateRangeValue = process.env.UPDATE_RANGE;
export const concurrent = process.env.CONCURRENT;
export const extractTitle = process.env.EXTRACT_TITLE;
export const extractContacts = process.env.EXTRACT_CONTACTS;
export const extractAddress = process.env.EXTRACT_ADDRESS;
export const extractUsefulInformation = process.env.EXTRACT_USEFUL_INFORMATION;
export const extractServices = process.env.EXTRACT_SERVICES;
export const extractActivities = process.env.EXTRACT_ACTIVITIES;
export const extractLowerRatingIds = process.env.EXTRACT_LOWER_RATING_IDS;

// Playwright resource to exclude arr
export const RESOURCE_EXCLUSIONS = ['image', 'stylesheet', 'media', 'font'];
