import { generateId } from "../../common/utils/generateId";
import { TrelloAction } from "../../common/types/trelloActions";
import { TaskData } from "../../common/types/taskData";
import { TrelloState } from "../../common/types/trelloState";
import {
  insertItemAtIndex,
  moveItem,
  removeItemAtIndex,
} from "../../common/utils/arrayUtils";
import { filterObject } from "../../common/utils/objectUtils";

export const reducer = (
  state: TrelloState,
  action: TrelloAction,
): TrelloState => {
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

      const newImages = filterObject(
        state.images,
        (key) => !existedTask.imageIds.includes(key),
      );

      const newTasks = filterObject(state.tasks, (key) => key !== taskId);
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
        const shallowCoppyTasks = [...tasks];
        return shallowCoppyTasks.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          return sortDirection === "ASC"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
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
      const sourceIndex = sourceColumn.taskIds.indexOf(taskId);

      if (sourceColumnId === targetColumnId) {
        if (sourceIndex === targetIndex) {
          return state;
        }

        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: moveItem(sourceColumn.taskIds, sourceIndex, targetIndex),
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
            taskIds: removeItemAtIndex(sourceColumn.taskIds, sourceIndex),
          },
          [targetColumnId]: {
            ...targetColumn,
            taskIds: insertItemAtIndex(
              targetColumn.taskIds,
              taskId,
              targetIndex,
            ),
          },
        },
      };
    }
    default:
      return state;
  }
};
