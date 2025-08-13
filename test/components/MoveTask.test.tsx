import { render, screen, fireEvent } from "@testing-library/react";
import { MoveTask } from "../../src/components/MoveTask";
import "@testing-library/jest-dom";

jest.mock("../../src/components/MoveTaskForm", () => ({
  MoveTaskForm: jest.fn(() => (
    <div data-testid="mock-move-task-form">Mock MoveTaskForm</div>
  )),
}));

describe("MoveTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should open the dialog and render MoveTaskForm when icon button is clicked", () => {
    render(<MoveTask taskId="task-1" columnId="column-1" />);

    // Initially, the dialog and form should not be present
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-move-task-form")).not.toBeInTheDocument();

    // Click the icon button to open the dialog
    const moveIconButton = screen.getByRole("button", { name: /moveTask/i });
    fireEvent.click(moveIconButton);

    // After clicking, the dialog should be open and contain the form
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-move-task-form")).toBeInTheDocument();
  });
});
