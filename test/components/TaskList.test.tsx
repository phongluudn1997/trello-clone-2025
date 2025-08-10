import { render } from "@testing-library/react";
import { TaskList } from "../../src/components/TaskList";
import { useTrello } from "../../src/common/hooks/useTrello";
import { TaskCard } from "../../src/components/TaskCard";
import { TaskData } from "../../src/providers/TrelloProvider";

jest.mock("../../src/components/TaskCard", () => ({
  TaskCard: jest.fn(({ columnId }) => (
    <div data-testid={`mock-task-${columnId}`}>Mock TaskCard</div>
  )),
}));

jest.mock("../../src/common/hooks/useTrello");

const tasksByColumnIdMock = jest.fn();

describe("TaskList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTrello as jest.Mock).mockReturnValue({
      tasksByColumnId: tasksByColumnIdMock,
    });
  });

  test("should not render list of task if no tasks", () => {
    tasksByColumnIdMock.mockReturnValue([]);
    render(<TaskList columnId="column-1" />);
    expect(TaskCard).toHaveBeenCalledTimes(0);
  });

  test("should render tasks", () => {
    const mockTask: TaskData = {
      id: "task-1",
      favorite: false,
      description: "",
      imageIds: [],
      name: "Task 1",
    };
    tasksByColumnIdMock.mockReturnValue([{ mockTask }]);
    render(<TaskList columnId="column-1" />);
    expect(TaskCard).toHaveBeenCalledTimes(1);
  });
});
