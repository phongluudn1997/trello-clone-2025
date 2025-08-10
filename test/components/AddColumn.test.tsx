import { AddColumn } from "../../src/components/AddColumn.tsx";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useToggle } from "../../src/common/hooks/useToggle";
import { useTrello } from "../../src/common/hooks/useTrello";
import { useForm } from "../../src/common/hooks/useForm";

jest.mock("../../src/common/hooks/useTrello");
jest.mock("../../src/common/hooks/useToggle");
jest.mock("../../src/common/hooks/useForm");

describe("AddColumn", () => {
  const mockAddColumn = jest.fn();
  const mockToggleForm = jest.fn();
  const mockReset = jest.fn();
  const mockHandleChange = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test to ensure a clean state
    jest.clearAllMocks();
    (useTrello as jest.Mock).mockReturnValue({
      addColumn: mockAddColumn,
    });
    (useToggle as jest.Mock).mockReturnValue([false, mockToggleForm]);
    (useForm as jest.Mock).mockReturnValue({
      formState: { name: "" },
      handleChange: mockHandleChange,
      reset: mockReset,
    });
  });

  test("should render AddColumn button in the initial state", () => {
    render(<AddColumn />);
    const addButton = screen.getByRole("button", { name: /add column/i });
    expect(addButton).toBeInTheDocument();
  });

  test("should open the form when 'Add Column' button is clicked", () => {
    // Mock the useToggle hook to return true for isFormOpen, simulating a click
    (useToggle as jest.Mock).mockReturnValue([true, mockToggleForm]);

    render(<AddColumn />);

    // Check for form-related elements to confirm the form is open
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("should close the form and reset it when the Cancel icon is clicked", () => {
    // Start with the form open
    (useToggle as jest.Mock).mockReturnValue([true, mockToggleForm]);
    render(<AddColumn />);

    // Simulate clicking the Cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Verify that the correct functions are called
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockToggleForm).toHaveBeenCalledTimes(1);
  });

  test("should submit the form with a new column name", () => {
    (useToggle as jest.Mock).mockReturnValue([true, mockToggleForm]);

    (useForm as jest.Mock).mockReturnValue({
      formState: { name: "New Column" },
      handleChange: mockHandleChange,
      reset: mockReset,
    });

    render(<AddColumn />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockAddColumn).toHaveBeenCalledTimes(1);
    expect(mockAddColumn).toHaveBeenCalledWith({ name: "New Column" });
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockToggleForm).toHaveBeenCalledTimes(1);
  });
});
