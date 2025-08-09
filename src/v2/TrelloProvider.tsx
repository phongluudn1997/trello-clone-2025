import {
  type PropsWithChildren,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import {
  type AddColumnPayload,
  type AddTaskPayload,
  type DeleteTaskPayload,
  type EditTaskPayload,
  TrelloContext,
} from "./TrelloContext.ts";
import { generateId } from "./utils/generateId.ts";

export interface ColumnData {
  id: string;
  name: string;
  taskIds: string[];
}

export interface TaskData {
  id: string;
  name: string;
  description: string;
  deadline?: string | Date;
}

interface TrelloState {
  columns: Record<string, ColumnData>;
  tasks: Record<string, TaskData>;
  columnIds: string[];
}

const initialState: TrelloState = {
  columns: {},
  tasks: {},
  columnIds: [],
};

export const TrelloProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const columns = useMemo(
    () => state.columnIds.map((columnId) => state.columns[columnId]),
    [state.columnIds, state.columns],
  );
  const tasksByColumnId = useCallback(
    (columnId: string) =>
      state.columns[columnId].taskIds.map((taskId) => state.tasks[taskId]),
    [state.columns, state.tasks],
  );
  const getTaskById = useCallback(
    (taskId: string) => state.tasks[taskId],
    [state.tasks],
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

  return (
    <TrelloContext.Provider
      value={{
        columns,
        addColumn,
        addTask,
        tasksByColumnId,
        deleteTask,
        getTaskById,
        editTask,
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
          [id]: { id, name: action.payload.name, taskIds: [] },
        },
        columnIds: [...state.columnIds, id],
      };
    }
    case "ADD_TASK": {
      const id = generateId();
      const { name, columnId } = action.payload;

      // TODO: Test this
      if (!(columnId in state.columns)) {
        throw new Error("Does not find column");
      }

      return {
        ...state,
        tasks: { ...state.tasks, [id]: { id, name, description: "" } },
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

      if (!(taskId in state.tasks)) {
        throw new Error("Does not find task");
      }

      if (!(columnId in state.columns)) {
        throw new Error("Does not find column");
      }

      if (!state.columns[columnId].taskIds.includes(taskId)) {
        throw new Error("Task does not belong to Column");
      }

      const tasks = state.tasks;
      const newTasks = Object.assign({}, tasks);
      delete newTasks[taskId];

      const column = state.columns[columnId];
      const taskIds = column.taskIds.filter((id) => id !== taskId);

      return {
        ...state,
        tasks: newTasks,
        columns: { ...state.columns, [columnId]: { ...column, taskIds } },
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
            id: taskId,
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
  | { type: "EDIT_TASK"; payload: EditTaskPayload };
