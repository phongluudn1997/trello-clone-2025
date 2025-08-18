import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTrello } from "../../src/common/hooks/useTrello";
import { ColumnData } from "../../src/common/types/columnData";
import { MoveTaskForm } from "../../src/components/MoveTaskForm";
import { useTrelloDialog } from "../../src/components/dialog/useTrelloDialog";

jest.mock("../../src/common/hooks/useTrello");
jest.mock("../../src/components/dialog/useTrelloDialog");

describe("MoveTaskForm", () => {
  const mockMoveTask = jest.fn();
  const mockSetIsOpen = jest.fn();
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
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useTrello as jest.Mock).mockReturnValue({
      columns: mockColumns,
      moveTask: mockMoveTask,
      selectColumnById: (columnId: string) =>
        mockColumns.find((column) => column.id === columnId),
    });

    (useTrelloDialog as jest.Mock).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
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
      targetIndex: 1,
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
