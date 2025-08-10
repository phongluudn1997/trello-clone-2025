import { render, screen, fireEvent } from "@testing-library/react";
import { AddTask } from "../../src/components/AddTask";
import { useTrello } from "../../src/common/hooks/useTrello";
import { useToggle } from "../../src/common/hooks/useToggle";
import { useForm } from "../../src/common/hooks/useForm";
import "@testing-library/jest-dom";

jest.mock("../../src/common/hooks/useTrello");
jest.mock("../../src/common/hooks/useToggle");
jest.mock("../../src/common/hooks/useForm");

describe("AddTask", () => {
  const mockAddTask = jest.fn();
  const mockToggleForm = jest.fn();
  const mockReset = jest.fn();
  const mockHandleChange = jest.fn();
  const mockColumnId = "column-1";

  beforeEach(() => {
    jest.clearAllMocks();

    (useTrello as jest.Mock).mockReturnValue({
      addTask: mockAddTask,
    });
    (useToggle as jest.Mock).mockReturnValue([false, mockToggleForm]);
    (useForm as jest.Mock).mockReturnValue({
      formState: { name: "" },
      handleChange: mockHandleChange,
      reset: mockReset,
    });
  });

  test("should render 'Add Task' button in the initial state", () => {
    render(<AddTask columnId={mockColumnId} />);
    const addButton = screen.getByRole("button", { name: /add task/i });
    expect(addButton).toBeInTheDocument();
  });

  // Test case 2: Clicking the button opens the form
  test("should open the form when 'Add Task' button is clicked", () => {
    (useToggle as jest.Mock).mockReturnValue([true, mockToggleForm]);

    render(<AddTask columnId={mockColumnId} />);

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("should close the form when the Cancel icon is clicked", () => {
    (useToggle as jest.Mock).mockReturnValue([true, mockToggleForm]);
    render(<AddTask columnId={mockColumnId} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockToggleForm).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  test("should submit the form with a new task name", () => {
    (useToggle as jest.Mock).mockReturnValue([true, mockToggleForm]);

    (useForm as jest.Mock).mockReturnValue({
      formState: { name: "New Task" },
      handleChange: mockHandleChange,
      reset: mockReset,
    });

    render(<AddTask columnId={mockColumnId} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockAddTask).toHaveBeenCalledTimes(1);
    expect(mockAddTask).toHaveBeenCalledWith({
      columnId: mockColumnId,
      name: "New Task",
    });
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockToggleForm).toHaveBeenCalledTimes(1);
  });
});
