import { reducer } from "./trelloReducer";
import { TrelloAction } from "../../common/types/trelloActions";
import { TrelloState } from "../../common/types/trelloState";
import { ColumnData } from "../../common/types/columnData";
import { TaskData } from "../../common/types/taskData";

describe("trelloReducer", () => {
  test("should add a new column", () => {
    const initialState: TrelloState = {
      columnIds: [],
      columns: {},
      images: {},
      tasks: {},
    };
    const action: TrelloAction = {
      type: "ADD_COLUMN",
      payload: { name: "To Do" },
    };

    const newState = reducer(initialState, action);
    const [toDoColumnId] = newState.columnIds;

    expect(newState.columnIds).toHaveLength(1);
    expect(newState.columns).toHaveProperty(toDoColumnId);
    expect(newState.columns[toDoColumnId].name).toBe("To Do");
  });

  test("should add a new task to an existing column", () => {
    const existingColumn: ColumnData = {
      name: "To Do",
      taskIds: [],
      sort: "ASC",
      id: "column-1",
    };
    const initialState: TrelloState = {
      columnIds: [existingColumn.id],
      columns: { [existingColumn.id]: existingColumn },
      images: {},
      tasks: {},
    };
    const action: TrelloAction = {
      type: "ADD_TASK",
      payload: {
        name: "Task 1",
        columnId: existingColumn.id,
      },
    };

    const newState = reducer(initialState, action);
    const [addedTaskId] = newState.columns[existingColumn.id].taskIds;

    expect(newState.columns[existingColumn.id].taskIds).toHaveLength(1);
    expect(newState.columns[existingColumn.id].taskIds).toContain(addedTaskId);
    expect(newState.tasks).toHaveProperty(addedTaskId);
    expect(newState.tasks[addedTaskId].name).toBe("Task 1");
  });

  test("should throw error if adding a task with invalid columnId", () => {
    const initialState: TrelloState = {
      columnIds: [],
      columns: {},
      images: {},
      tasks: {},
    };
    const action: TrelloAction = {
      type: "ADD_TASK",
      payload: { name: "Task 1", columnId: "non-existing" },
    };

    expect(() => reducer(initialState, action)).toThrow();
  });

  test("should now update update state if delete non-existing task", () => {
    const initialState: TrelloState = {
      columnIds: [],
      tasks: {},
      columns: {},
      images: {},
    };
    const action: TrelloAction = {
      type: "DELETE_TASK",
      payload: { taskId: "task-1", columnId: "column-1" },
    };

    const nextState = reducer(initialState, action);

    expect(nextState).toStrictEqual(initialState);
  });
  test("should do nothing if delete task of non-existing column", () => {
    const task: TaskData = {
      id: "task-1",
      name: "Task 1",
      imageIds: [],
      favorite: false,
      description: "Task 1 Description",
    };
    const initialState: TrelloState = {
      columns: {},
      tasks: {
        [task.id]: task,
      },
      images: {},
      columnIds: [],
    };
    const action: TrelloAction = {
      type: "DELETE_TASK",
      payload: { taskId: task.id, columnId: "column-1" },
    };
    const newState = reducer(initialState, action);
    expect(newState).toStrictEqual(initialState);
  });
  test("should do nothing if delete task with wrong column", () => {
    const task: TaskData = {
      id: "task-1",
      name: "Task 1",
      favorite: false,
      imageIds: [],
      description: "",
    };
    const column: ColumnData = {
      id: "column-1",
      name: "Column 1",
      taskIds: [],
      sort: "ASC",
    };
    const initialState: TrelloState = {
      columnIds: [column.id],
      tasks: {
        [task.id]: task,
      },
      columns: { [column.id]: column },
      images: {},
    };

    const action: TrelloAction = {
      type: "DELETE_TASK",
      payload: { taskId: task.id, columnId: column.id },
    };

    const nextState = reducer(initialState, action);
    expect(nextState).toStrictEqual(initialState);
  });
  test("should delete task", () => {
    const task: TaskData = {
      id: "task-1",
      name: "Task 1",
      favorite: false,
      imageIds: [],
      description: "",
    };
    const column: ColumnData = {
      id: "column-1",
      name: "Column 1",
      taskIds: [task.id],
      sort: "ASC",
    };
    const initialState: TrelloState = {
      columnIds: [column.id],
      tasks: {
        [task.id]: task,
      },
      columns: { [column.id]: column },
      images: {},
    };

    const action: TrelloAction = {
      type: "DELETE_TASK",
      payload: { taskId: task.id, columnId: column.id },
    };

    expect(initialState.columns[column.id].taskIds).toHaveLength(1);
    expect(initialState.tasks).toHaveProperty(task.id);

    const nextState = reducer(initialState, action);

    expect(nextState.columns[column.id].taskIds).toHaveLength(0);
    expect(nextState.tasks).not.toHaveProperty(task.id);
  });

  describe("Edit Task", () => {
    const task: TaskData = {
      id: "task-1",
      name: "Task 1",
      description: "",
      imageIds: [],
      favorite: false,
    };
    test("should return same state if found no task", () => {
      const updatedTask: TaskData = {
        id: "task-1",
        name: "Task 1 Updated",
        description: "",
        imageIds: [],
        favorite: false,
      };

      const initialState: TrelloState = {
        columnIds: [],
        tasks: {},
        columns: {},
        images: {},
      };

      const action: TrelloAction = {
        type: "EDIT_TASK",
        payload: { taskId: task.id, updatedTask },
      };

      const nextState = reducer(initialState, action);
      expect(nextState).toStrictEqual(initialState);
    });

    test("should not allow to override the task id", () => {
      const updatedTask: TaskData = {
        ...task,
        id: "task-2",
      };

      const initialState: TrelloState = {
        columnIds: [],
        tasks: {},
        columns: {},
        images: {},
      };

      const action: TrelloAction = {
        type: "EDIT_TASK",
        payload: { taskId: task.id, updatedTask },
      };

      const nextState = reducer(initialState, action);
      expect(nextState).toStrictEqual(initialState);
    });
    test("should not allow to edit the attachments", () => {
      const initialState: TrelloState = {
        columnIds: [],
        images: {},
        columns: {},
        tasks: { [task.id]: task },
      };

      const action: TrelloAction = {
        type: "EDIT_TASK",
        payload: {
          taskId: task.id,
          updatedTask: { ...task, imageIds: ["image-1"] },
        },
      };

      const nextState = reducer(initialState, action);

      expect(nextState).toStrictEqual(initialState);
    });

    test("should update task", () => {
      const initialState: TrelloState = {
        columnIds: [],
        columns: {},
        images: {},
        tasks: { [task.id]: task },
      };
      const action: TrelloAction = {
        type: "EDIT_TASK",
        payload: {
          taskId: task.id,
          updatedTask: { ...task, name: "Task 1 Updated" },
        },
      };
      const nextState = reducer(initialState, action);
      expect(nextState.tasks[task.id].name).toBe("Task 1 Updated");
    });
  });

  describe("Upload image", () => {
    test("should upload image", () => {
      const initialState: TrelloState = {
        columnIds: [],
        images: {},
        columns: {},
        tasks: {},
      };

      const action: TrelloAction = {
        type: "UPLOAD_IMAGE",
        payload: {
          imageId: "image-1",
          fileName: "image.png",
          base64Url: "data:image/png;base64,mockData",
        },
      };

      const nextState = reducer(initialState, action);
      expect(nextState.images).toHaveProperty("image-1");
    });
  });
});
