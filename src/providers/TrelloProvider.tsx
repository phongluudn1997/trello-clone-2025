import { type PropsWithChildren, useCallback, useMemo } from "react";
import { TrelloContext } from "./TrelloContext";
import { generateId } from "../common/utils/generateId";
import { useLocalStorage } from "../common/hooks/useLocalStorage";

import { reducer } from "./trelloReducer";
import { TrelloState } from "../common/types/trelloState";
import {
  AddColumnPayload,
  AddImageToTaskPayload,
  AddTaskPayload,
  DeleteTaskPayload,
  EditTaskPayload,
  MoveTaskPayload,
  SortTasksPayload,
  ToggleFavoritePayload,
  TrelloAction,
  UploadImagePayload,
} from "../common/types/trelloActions";

const initialValue: TrelloState = {
  columns: {},
  tasks: {},
  columnIds: [],
  images: {},
};

export const TrelloProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useLocalStorage<TrelloState, TrelloAction>({
    key: "trello",
    reducer,
    initialValue,
  });

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
    [dispatch],
  );

  const addTask = useCallback(
    (addTaskPayload: AddTaskPayload) =>
      dispatch({
        type: "ADD_TASK",
        payload: addTaskPayload,
      }),
    [dispatch],
  );
  const deleteTask = useCallback(
    (deleteTaskPayload: DeleteTaskPayload) =>
      dispatch({
        type: "DELETE_TASK",
        payload: deleteTaskPayload,
      }),
    [dispatch],
  );

  const editTask = useCallback(
    (editTaskPayload: EditTaskPayload) =>
      dispatch({ type: "EDIT_TASK", payload: editTaskPayload }),
    [dispatch],
  );

  const uploadImage = useCallback(
    (uploadImagePayload: UploadImagePayload) => {
      const imageId = generateId();
      dispatch({
        type: "UPLOAD_IMAGE",
        payload: {
          ...uploadImagePayload,
          imageId,
        },
      });
      return imageId;
    },
    [dispatch],
  );

  const addImageToTask = useCallback(
    (addImageToTaskPayload: AddImageToTaskPayload) =>
      dispatch({ type: "ADD_IMAGE_TO_TASK", payload: addImageToTaskPayload }),
    [dispatch],
  );

  const sortTasks = useCallback(
    (sortTasksPayload: SortTasksPayload) => {
      dispatch({ type: "SORT_TASKS", payload: sortTasksPayload });
    },
    [dispatch],
  );

  const toggleFavorite = useCallback(
    (toggleFavoritePayload: ToggleFavoritePayload) =>
      dispatch({ type: "TOGGLE_FAVORITE", payload: toggleFavoritePayload }),
    [dispatch],
  );

  const moveTask = useCallback(
    (moveTaskPayload: MoveTaskPayload) => {
      dispatch({ type: "MOVE_TASK", payload: moveTaskPayload });
    },
    [dispatch],
  );

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
