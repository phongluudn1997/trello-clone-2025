import { ColumnData } from "./columnData";
import { TaskData } from "./taskData";
import { ImageData } from "./imageData";

export interface TrelloState {
  columns: Record<string, ColumnData>;
  tasks: Record<string, TaskData>;
  columnIds: string[];
  images: Record<string, ImageData>;
}
