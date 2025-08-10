import { createContext } from "react";
import type {
  ColumnData,
  ImageData,
  SortDirection,
  TaskData,
} from "./TrelloProvider.tsx";

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

interface TrelloContextValue {
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
}

export const TrelloContext = createContext<TrelloContextValue | undefined>(
  undefined,
);
