import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  type AddColumnPayload,
  type AddImageToTaskPayload,
  type AddTaskPayload,
  type DeleteTaskPayload,
  type EditTaskPayload,
  type MoveTaskPayload,
  type SortTasksPayload,
  type ToggleFavoritePayload,
  TrelloContext,
  type UploadImagePayload,
} from "./TrelloContext.ts";
import { generateId } from "../common/utils/generateId.ts";

export type SortDirection = "ASC" | "DESC" | undefined;

export interface ColumnData {
  id: string;
  name: string;
  taskIds: string[];
  sort: SortDirection;
}

export interface TaskData {
  id: string;
  name: string;
  description: string;
  imageIds: string[];
  deadline?: string | Date;
  favorite: boolean;
}

export interface ImageData {
  fileName: string;
  base64Url: string;
}

interface TrelloState {
  columns: Record<string, ColumnData>;
  tasks: Record<string, TaskData>;
  columnIds: string[];
  images: Record<string, ImageData>;
}

export const TrelloProvider = ({ children }: PropsWithChildren) => {
  const persistedData = window.localStorage.getItem("trello");
  const initialData = persistedData
    ? JSON.parse(persistedData)
    : {
        columns: {},
        tasks: {},
        columnIds: [],
      };

  const [state, dispatch] = useReducer(reducer, initialData);

  useEffect(() => {
    window.localStorage.setItem("trello", JSON.stringify(state));
  }, [state]);

  const selectColumns = useMemo(
    () => state.columnIds.map((columnId) => state.columns[columnId]),
    [state.columnIds, state.columns],
  );

  const selectTasksByColumnId = useCallback(
    (columnId: string) =>
      state.columns[columnId].taskIds.map((taskId) => state.tasks[taskId]),
    [state.columns, state.tasks],
  );

  const selectTaskById = useCallback(
    (taskId: string) => state.tasks[taskId],
    [state.tasks],
  );

  const selectImageById = useCallback(
    (imageId: string) => state.images[imageId],
    [state.images],
  );

  const selectColumnById = useCallback(
    (columnId: string) => state.columns[columnId],
    [state.columns],
  );

  const addColumn = useCallback(
    (addColumnPayload: AddColumnPayload) =>
      dispatch({
        type: "ADD_COLUMN",
        payload: addColumnPayload,
      }),
    [],
  );

  const addTask = useCallback(
    (addTaskPayload: AddTaskPayload) =>
      dispatch({
        type: "ADD_TASK",
        payload: addTaskPayload,
      }),
    [],
  );
  const deleteTask = useCallback(
    (deleteTaskPayload: DeleteTaskPayload) =>
      dispatch({
        type: "DELETE_TASK",
        payload: deleteTaskPayload,
      }),
    [],
  );

  const editTask = useCallback(
    (editTaskPayload: EditTaskPayload) =>
      dispatch({ type: "EDIT_TASK", payload: editTaskPayload }),
    [],
  );

  const uploadImage = useCallback((uploadImagePayload: UploadImagePayload) => {
    const imageId = generateId();
    dispatch({
      type: "UPLOAD_IMAGE",
      payload: {
        ...uploadImagePayload,
        imageId,
      },
    });
    return imageId;
  }, []);

  const addImageToTask = useCallback(
    (addImageToTaskPayload: AddImageToTaskPayload) =>
      dispatch({ type: "ADD_IMAGE_TO_TASK", payload: addImageToTaskPayload }),
    [],
  );

  const sortTasks = useCallback((sortTasksPayload: SortTasksPayload) => {
    dispatch({ type: "SORT_TASKS", payload: sortTasksPayload });
  }, []);

  const toggleFavorite = useCallback(
    (toggleFavoritePayload: ToggleFavoritePayload) =>
      dispatch({ type: "TOGGLE_FAVORITE", payload: toggleFavoritePayload }),
    [],
  );

  const moveTask = useCallback((moveTaskPayload: MoveTaskPayload) => {
    dispatch({ type: "MOVE_TASK", payload: moveTaskPayload });
  }, []);

  return (
    <TrelloContext.Provider
      value={{
        columns: selectColumns,
        addColumn,
        addTask,
        tasksByColumnId: selectTasksByColumnId,
        deleteTask,
        getTaskById: selectTaskById,
        editTask,
        uploadImage,
        getImageById: selectImageById,
        addImageToTask,
        sortTasks,
        toggleFavorite,
        selectColumnById,
        moveTask,
      }}
    >
      {children}
    </TrelloContext.Provider>
  );
};

const reducer = (state: TrelloState, action: Action): TrelloState => {
  switch (action.type) {
    case "ADD_COLUMN": {
      const id = generateId();
      return {
        ...state,
        columns: {
          ...state.columns,
          [id]: { id, name: action.payload.name, taskIds: [], sort: undefined },
        },
        columnIds: [...state.columnIds, id],
      };
    }
    case "ADD_TASK": {
      const id = generateId();
      const { name, columnId } = action.payload;

      if (!(columnId in state.columns)) {
        throw new Error("Does not find column");
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: { id, name, description: "", imageIds: [], favorite: false },
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            taskIds: [...state.columns[columnId].taskIds, id],
          },
        },
      };
    }
    case "DELETE_TASK": {
      const { taskId, columnId } = action.payload;
      const existedTask = state.tasks[taskId];
      const existedColumn = state.columns[columnId];

      if (!existedTask) {
        console.error(`Task with id ${taskId} not found.`);
        return state;
      }

      if (!existedColumn) {
        throw new Error("Does not find column");
      }

      if (!existedColumn.taskIds.includes(taskId)) {
        throw new Error("Task does not belong to Column");
      }

      const newImages = { ...state.images };
      existedTask.imageIds.forEach((imageId) => delete newImages[imageId]);

      const newTasks = { ...state.tasks };
      delete newTasks[taskId];

      const taskIds = existedColumn.taskIds.filter((id) => id !== taskId);

      return {
        ...state,
        tasks: newTasks,
        columns: {
          ...state.columns,
          [columnId]: { ...existedColumn, taskIds },
        },
        images: newImages,
      };
    }
    case "EDIT_TASK": {
      const { taskId, updatedTask } = action.payload;
      const currentTask = state.tasks[taskId];

      if (!currentTask) {
        console.error(`Task with id ${taskId} not found.`);
        return state;
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...currentTask,
            ...updatedTask,
            // Avoid overriding uploaded images with old data,
            // New images must be added via ADD_IMAGE_TO_TASK
            imageIds: currentTask.imageIds,
            id: taskId,
          },
        },
      };
    }
    case "UPLOAD_IMAGE": {
      const { base64Url, fileName, imageId } = action.payload;

      return {
        ...state,
        images: { ...state.images, [imageId]: { fileName, base64Url } },
      };
    }
    case "ADD_IMAGE_TO_TASK": {
      const { imageId, taskId } = action.payload;
      const existedTask = state.tasks[taskId];
      const existedImage = state.images[imageId];

      if (!existedImage) {
        console.error(`Image with id ${imageId} not found.`);
        return state;
      }
      if (!existedTask) {
        console.error(`Task with id ${taskId} not found.`);
        return state;
      }
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...existedTask,
            imageIds: [...existedTask.imageIds, imageId],
          },
        },
      };
    }
    case "SORT_TASKS": {
      const { columnId, sortDirection } = action.payload;
      const existedColumn = state.columns[columnId];
      if (!existedColumn) {
        console.error(`Column with id ${columnId} not found.`);
        return state;
      }

      const sortByName = (tasks: TaskData[]): TaskData[] => {
        return tasks.sort((a, b) => {
          if (sortDirection === "ASC") {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
          }
          if (sortDirection === "DESC") {
            return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
          }
          return 0;
        });
      };

      const tasks = existedColumn.taskIds.map((taskId) => state.tasks[taskId]);
      const favoriteTasks = tasks.filter((task) => task.favorite);
      const unfavoriteTasks = tasks.filter((task) => !task.favorite);

      const sortedTaskIds = [
        ...sortByName(favoriteTasks).map((task) => task.id),
        ...sortByName(unfavoriteTasks).map((task) => task.id),
      ];

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...existedColumn,
            taskIds: sortedTaskIds,
            sort: sortDirection,
          },
        },
      };
    }
    case "TOGGLE_FAVORITE": {
      const { taskId } = action.payload;
      const existedTask = state.tasks[taskId];
      if (!existedTask) {
        console.log(`Task with id ${taskId} not found.`);
        return state;
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...existedTask, favorite: !existedTask.favorite },
        },
      };
    }
    case "MOVE_TASK": {
      const { taskId, sourceColumnId, targetColumnId, targetIndex } =
        action.payload;
      const sourceColumn = state.columns[sourceColumnId];
      const targetColumn = state.columns[targetColumnId];

      if (sourceColumnId === targetColumnId) {
        const removedTaskIds = sourceColumn.taskIds.filter(
          (id) => id !== taskId,
        );
        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: [
                ...removedTaskIds.slice(0, targetIndex),
                taskId,
                ...removedTaskIds.slice(targetIndex),
              ],
            },
          },
        };
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColumnId]: {
            ...sourceColumn,
            taskIds: sourceColumn.taskIds.filter((id) => id !== taskId),
          },
          [targetColumnId]: {
            ...targetColumn,
            taskIds: [
              ...targetColumn.taskIds.slice(0, targetIndex),
              taskId,
              ...targetColumn.taskIds.slice(targetIndex),
            ],
          },
        },
      };
    }
    default:
      return state;
  }
};

type Action =
  | { type: "ADD_COLUMN"; payload: AddColumnPayload }
  | { type: "ADD_TASK"; payload: AddTaskPayload }
  | { type: "DELETE_TASK"; payload: DeleteTaskPayload }
  | { type: "EDIT_TASK"; payload: EditTaskPayload }
  | { type: "UPLOAD_IMAGE"; payload: UploadImagePayload & { imageId: string } }
  | { type: "ADD_IMAGE_TO_TASK"; payload: AddImageToTaskPayload }
  | { type: "SORT_TASKS"; payload: SortTasksPayload }
  | { type: "TOGGLE_FAVORITE"; payload: ToggleFavoritePayload }
  | { type: "MOVE_TASK"; payload: MoveTaskPayload };
