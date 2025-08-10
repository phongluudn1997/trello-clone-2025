import { render, screen, fireEvent } from "@testing-library/react";
import { MoveTask, MoveTaskForm } from "../../src/components/MoveTask";
import { useTrello } from "../../src/common/hooks/useTrello";
import "@testing-library/jest-dom";

import { ColumnData } from "../../src/common/types/columnData";

jest.mock("../../src/common/hooks/useTrello");

describe("MoveTask", () => {
  const mockProps = {
    taskId: "task-1",
    columnId: "column-1",
  };

  const mockMoveTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTrello as jest.Mock).mockReturnValue({
      columns: [],
      moveTask: mockMoveTask,
    });
  });

  test("should open the dialog and render MoveTaskForm when icon button is clicked", () => {
    render(<MoveTask {...mockProps} />);

    // Initially, the dialog and form should not be present
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-move-task-form")).not.toBeInTheDocument();

    // Click the icon button to open the dialog
    const moveIconButton = screen.getByRole("button", { name: /moveTask/i });
    fireEvent.click(moveIconButton);

    // After clicking, the dialog should be open and contain the form
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  test("should close the dialog when onClose is called from the form", () => {
    render(<MoveTask {...mockProps} />);

    // Open the dialog
    const moveIconButton = screen.getByRole("button", { name: /moveTask/i });
    fireEvent.click(moveIconButton);

    // Find the close button within the mocked form and click it
    const closeButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(closeButton);

    // The form should no longer be in the document
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });
});

describe("MoveTaskForm", () => {
  const mockMoveTask = jest.fn();
  const mockOnClose = jest.fn();
  const mockColumns: ColumnData[] = [
    {
      id: "column-1",
      name: "To Do",
      sort: "ASC",
      taskIds: ["task-1", "task-2"],
    },
    { id: "column-2", name: "In Progress", sort: "ASC", taskIds: ["task-3"] },
    { id: "column-3", name: "Done", sort: "ASC", taskIds: [] },
  ];
  const mockProps = {
    taskId: "task-1",
    columnId: "column-1",
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useTrello as jest.Mock).mockReturnValue({
      columns: mockColumns,
      moveTask: mockMoveTask,
    });
  });

  test("should render 2 select element", () => {
    render(<MoveTaskForm {...mockProps} />);

    // Check if the select menus are present
    const selectElements = screen.queryAllByRole("combobox");
    expect(selectElements.length).toBe(2);
  });

  test("should call moveTask with correct values on form submission", () => {
    render(<MoveTaskForm {...mockProps} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if moveTask was called with the initial form state
    expect(mockMoveTask).toHaveBeenCalledTimes(1);
    expect(mockMoveTask).toHaveBeenCalledWith({
      taskId: "task-1",
      sourceColumnId: "column-1",
      targetColumnId: "column-1",
      targetIndex: 0,
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("should change the target column and update position options", () => {
    render(<MoveTaskForm {...mockProps} />);

    // Find the target column select input
    const targetColumnSelect = screen.getAllByRole("combobox")[0];
    fireEvent.mouseDown(targetColumnSelect);

    // Click on the 'In Progress' menu item
    const inProgressMenuItem = screen.getByRole("option", {
      name: "In Progress",
    });
    fireEvent.click(inProgressMenuItem);

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if moveTask was called with the updated state
    expect(mockMoveTask).toHaveBeenCalledWith({
      taskId: "task-1",
      sourceColumnId: "column-1",
      targetColumnId: "column-2",
      targetIndex: 0,
    });
  });

  test("should change the target index", () => {
    render(<MoveTaskForm {...mockProps} />);

    // Find the position select input
    const positionSelect = screen.getAllByRole("combobox")[1];
    fireEvent.mouseDown(positionSelect);

    // Click on the option with index 1
    const indexMenuItem = screen.getByRole("option", { name: "1" });
    fireEvent.click(indexMenuItem);

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if moveTask was called with the updated state
    expect(mockMoveTask).toHaveBeenCalledWith({
      taskId: "task-1",
      sourceColumnId: "column-1",
      targetColumnId: "column-1",
      targetIndex: 1,
    });
  });
});
