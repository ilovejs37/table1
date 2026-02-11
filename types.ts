
export interface TableItem {
  name: string;
}

export interface AppState {
  data: TableItem[];
  assignedData: TableItem[];
  currentIndex: number;
  previousIndex: number;
  loading: boolean;
  error: string | null;
}
