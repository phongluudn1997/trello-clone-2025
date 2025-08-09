import { createContext } from "react";
import type { ColumnData, TaskData } from "./TrelloProvider.tsx";

export type AddColumnPayload = Pick<ColumnData, "name">;
export type AddTaskPayload = { name: string; columnId: string };
export type DeleteTaskPayload = { taskId: string; columnId: string };
export type EditTaskPayload = {
  taskId: string;
  updatedTask: Omit<TaskData, "id">;
};

interface TrelloContextValue {
  columns: ColumnData[];
  addColumn: (addColumnPayload: AddColumnPayload) => void;
  addTask: (addTaskPayload: AddTaskPayload) => void;
  deleteTask: (deleteTaskPayload: DeleteTaskPayload) => void;
  tasksByColumnId: (columnId: string) => TaskData[];
  getTaskById: (taskId: string) => TaskData | undefined;
  editTask: (editTaskPayload: EditTaskPayload) => void;
}

export const TrelloContext = createContext<TrelloContextValue | undefined>(
  undefined,
);
