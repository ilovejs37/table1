
import { createClient } from '@supabase/supabase-js';
import { TableItem } from '../types';

/**
 * Using the specific values provided by the user to ensure the app works correctly.
 * In a typical production environment, these would be in environment variables,
 * but for this context, we'll use the strings directly as requested to fix the error.
 */
const supabaseUrl = 'https://rkgccrculzfchjcbfhku.supabase.co';
const supabaseKey = 'sb_publishable_0vJf_-THnlqnBNdN97lmbg_cDD2ZZPV';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches the list of names from the 'table1' table in Supabase.
 */
export const fetchTableData = async (): Promise<TableItem[]> => {
  const { data, error } = await supabase
    .from('table1')
    .select('name');

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(error.message);
  }

  return (data || []) as TableItem[];
};
