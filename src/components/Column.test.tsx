import { render, screen } from "@testing-library/react";
import { TaskList } from "./TaskList";
import { AddTask } from "./AddTask";
import { Column } from "./Column";

jest.mock("./TaskList", () => ({
  TaskList: jest.fn(({ columnId }) => (
    <div data-testid={`taskList-${columnId}`}>Mock TaskList</div>
  )),
}));

jest.mock("./AddTask", () => ({
  AddTask: jest.fn(({ columnId }) => (
    <div data-testid={`addTask-${columnId}`}>Mock AddTask</div>
  )),
}));

jest.mock("./SortButton", () => ({
  SortButton: jest.fn(({ columnId, sort }) => (
    <div data-testid={`sortButton-${columnId}-${sort}`}>Mock SortButton</div>
  )),
}));

const mockTaskList = TaskList as jest.MockedFunction<typeof TaskList>;
const mockAddTask = AddTask as jest.MockedFunction<typeof AddTask>;

describe("Column", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render Column", () => {
    render(
      <Column name="Column Name" taskIds={[]} sort={"ASC"} id={"column-1"} />,
    );

    expect(screen.queryByTestId(/taskList-/)).toBeInTheDocument();
    expect(mockTaskList).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId(/addTask-/)).toBeInTheDocument();
    expect(mockAddTask).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId(/sortButton-/)).toBeInTheDocument();
    expect(mockAddTask).toHaveBeenCalledTimes(1);
  });
});
