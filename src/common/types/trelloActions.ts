import { SortDirection } from "./sortDirection";
import { ColumnData } from "./columnData";
import { TaskData } from "./taskData";
import { ImageData } from "./imageData";

export type AddColumnPayload = Pick<ColumnData, "name">;
export type AddTaskPayload = { name: string; columnId: string };
export type DeleteTaskPayload = { taskId: string; columnId: string };
export type EditTaskPayload = {
  taskId: string;
  updatedTask: Omit<TaskData, "id">;
};
export type UploadImagePayload = {
  fileName: string;
  base64Url: string;
};
export type AddImageToTaskPayload = { imageId: string; taskId: string };
export type SortTasksPayload = {
  columnId: string;
  sortDirection: SortDirection;
};
export type ToggleFavoritePayload = { taskId: string };
export type MoveTaskPayload = {
  taskId: string;
  sourceColumnId: string;
  targetColumnId: string;
  targetIndex: number;
};

export interface TrelloContextValue {
  columns: ColumnData[];
  addColumn: (addColumnPayload: AddColumnPayload) => void;
  addTask: (addTaskPayload: AddTaskPayload) => void;
  deleteTask: (deleteTaskPayload: DeleteTaskPayload) => void;
  tasksByColumnId: (columnId: string) => TaskData[];
  getTaskById: (taskId: string) => TaskData | undefined;
  editTask: (editTaskPayload: EditTaskPayload) => void;
  uploadImage: (uploadImagePayload: UploadImagePayload) => string;
  getImageById: (imageId: string) => ImageData | undefined;
  addImageToTask: (addImageToTask: AddImageToTaskPayload) => void;
  sortTasks: (sortTasksPayload: SortTasksPayload) => void;
  toggleFavorite: (toggleFavoritePayload: ToggleFavoritePayload) => void;
  selectColumnById: (columnId: string) => ColumnData | undefined;
  moveTask: (moveTaskPayload: MoveTaskPayload) => void;
}

export type TrelloAction =
  | { type: "ADD_COLUMN"; payload: AddColumnPayload }
  | { type: "ADD_TASK"; payload: AddTaskPayload }
  | { type: "DELETE_TASK"; payload: DeleteTaskPayload }
  | { type: "EDIT_TASK"; payload: EditTaskPayload }
  | { type: "UPLOAD_IMAGE"; payload: UploadImagePayload & { imageId: string } }
  | { type: "ADD_IMAGE_TO_TASK"; payload: AddImageToTaskPayload }
  | { type: "SORT_TASKS"; payload: SortTasksPayload }
  | { type: "TOGGLE_FAVORITE"; payload: ToggleFavoritePayload }
  | { type: "MOVE_TASK"; payload: MoveTaskPayload };
