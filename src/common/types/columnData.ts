import { SortDirection } from "./sortDirection";

export interface ColumnData {
  id: string;
  name: string;
  taskIds: string[];
  sort: SortDirection;
}
