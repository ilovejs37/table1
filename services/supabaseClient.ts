
import { createClient } from '@supabase/supabase-js';
import { TableItem } from '../types';

const supabaseUrl = process.env.Table_URL || '';
const supabaseKey = process.env.Table_KEY || '';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchTableData = async (): Promise<TableItem[]> => {
  const { data, error } = await supabase
    .from('table1')
    .select('name');

  if (error) {
    throw new Error(error.message);
  }

  return data as TableItem[];
};
