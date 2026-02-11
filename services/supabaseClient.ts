
import { createClient } from '@supabase/supabase-js';
import { TableItem } from '../types';

const supabaseUrl = 'https://rkgccrculzfchjcbfhku.supabase.co';
const supabaseKey = 'sb_publishable_0vJf_-THnlqnBNdN97lmbg_cDD2ZZPV';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches the list of names from the 'table1' table.
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

/**
 * Fetches the global assignment state. 
 * Assumes a table 'assignment_state' with a single row (id=1).
 */
export const fetchGlobalIndex = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('assignment_state')
    .select('current_index')
    .eq('id', 1)
    .single();

  if (error) {
    // If table doesn't exist or row missing, default to 0
    console.warn('Could not fetch global index, defaulting to 0:', error.message);
    return 0;
  }

  return data.current_index || 0;
};

/**
 * Updates the global assignment state in the database.
 */
export const updateGlobalIndex = async (newIndex: number): Promise<void> => {
  const { error } = await supabase
    .from('assignment_state')
    .update({ current_index: newIndex })
    .eq('id', 1);

  if (error) {
    console.error('Failed to update global index:', error);
    throw new Error('데이터베이스 상태 업데이트에 실패했습니다.');
  }
};
