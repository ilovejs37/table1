
export interface TableItem {
  name: string;
}

export interface AppState {
  data: TableItem[];
  loading: boolean;
  error: string | null;
  aiInsight: string | null;
  aiLoading: boolean;
}
