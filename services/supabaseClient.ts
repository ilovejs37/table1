
import { TableItem } from '../types';

/**
 * Note: Supabase fetching is disabled per user request.
 * Returning static data directly.
 */
export const fetchTableData = async (): Promise<TableItem[]> => {
  // Simulate a tiny delay for a natural feel
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [{ name: '최성진' }];
};

// Export an empty object or dummy client to prevent import errors elsewhere if necessary
export const supabase = {} as any;
