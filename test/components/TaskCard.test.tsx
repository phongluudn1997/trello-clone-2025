import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "../../src/components/TaskCard";
import { useTrello } from "../../src/common/hooks/useTrello";
import { EditTask } from "../../src/components/EditTask";
import { MoveTask } from "../../src/components/MoveTask";
import { FavoriteButton } from "../../src/components/FavoriteButton";
import "@testing-library/jest-dom";

jest.mock("../../src/components/EditTask", () => ({
  EditTask: jest.fn(({ task }) => (
    <div data-testid={`mock-edit-task-${task.id}`}>Mock EditTask</div>
  )),
}));
jest.mock("../../src/components/MoveTask", () => ({
  MoveTask: jest.fn(({ taskId, columnId }) => (
    <div data-testid={`mock-move-task-${taskId}-${columnId}`}>
      Mock MoveTask
    </div>
  )),
}));
jest.mock("../../src/components/FavoriteButton", () => ({
  FavoriteButton: jest.fn(({ task }) => (
    <div data-testid={`mock-favorite-button-${task.id}`}>
      Mock FavoriteButton
    </div>
  )),
}));

jest.mock("../../src/common/hooks/useTrello");

describe("TaskCard", () => {
  const mockDeleteTask = jest.fn();
  const mockTask = {
    id: "task-1",
    name: "Test Task",
    description: "A simple description",
    favorite: false,
    deadline: "",
    imageIds: [],
  };
  const mockColumnId = "column-1";

  beforeEach(() => {
    jest.clearAllMocks();
    (useTrello as jest.Mock).mockReturnValue({
      deleteTask: mockDeleteTask,
    });
  });

  test("should render the task name and child components", () => {
    render(<TaskCard task={mockTask} columnId={mockColumnId} />);

    const taskName = screen.getByText(mockTask.name);
    expect(taskName).toBeInTheDocument();

    const favoriteButtonMock = screen.getByTestId(
      `mock-favorite-button-${mockTask.id}`,
    );
    expect(favoriteButtonMock).toBeInTheDocument();
    expect(FavoriteButton).toHaveBeenCalledTimes(1);

    const editTaskMock = screen.getByTestId(`mock-edit-task-${mockTask.id}`);
    expect(editTaskMock).toBeInTheDocument();
    expect(EditTask).toHaveBeenCalledTimes(1);

    const moveTaskMock = screen.getByTestId(
      `mock-move-task-${mockTask.id}-${mockColumnId}`,
    );
    expect(moveTaskMock).toBeInTheDocument();
    expect(MoveTask).toHaveBeenCalledTimes(1);
  });

  test("should render the NotesIcon when the task has a description", () => {
    render(<TaskCard task={mockTask} columnId={mockColumnId} />);

    const notesIcon = screen.getByTestId("NotesIcon");
    expect(notesIcon).toBeInTheDocument();
  });

  test("should not render the NotesIcon when the task has no description", () => {
    const taskWithoutDescription = { ...mockTask, description: "" };
    render(<TaskCard task={taskWithoutDescription} columnId={mockColumnId} />);

    const notesIcon = screen.queryByTestId("NotesIcon");
    expect(notesIcon).not.toBeInTheDocument();
  });

  test("should call deleteTask with the correct taskId and columnId when the delete button is clicked", () => {
    render(<TaskCard task={mockTask} columnId={mockColumnId} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledTimes(1);
    expect(mockDeleteTask).toHaveBeenCalledWith({
      taskId: mockTask.id,
      columnId: mockColumnId,
    });
  });
});
