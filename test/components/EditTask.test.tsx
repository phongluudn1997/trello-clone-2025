import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditTask } from "../../src/components/EditTask";
import { useTrello } from "../../src/common/hooks/useTrello";
import { useForm } from "../../src/common/hooks/useForm";
import "@testing-library/jest-dom";
import { EditTaskForm } from "../../src/components/EditTaskForm";

jest.mock("../../src/common/hooks/useTrello");
jest.mock("../../src/common/hooks/useForm");

jest.mock("../../src/components/EditTaskForm", () => ({
  EditTaskForm: ({ task }) => (
    <div data-testid={`mock-edit-task-form-${task.id}`}>
      Mock EditTaskForm {task.id}
    </div>
  ),
}));

describe("EditTask", () => {
  // Define mock functions and data
  const mockEditTask = jest.fn();
  const mockUploadImage = jest.fn().mockReturnValue("image-1");
  const mockGetImageById = jest.fn();
  const mockAddImageToTask = jest.fn();
  const mockHandleChange = jest.fn();

  const mockTask = {
    id: "task-1",
    name: "Initial Task Name",
    description: "Initial description",
    deadline: "2025-01-01",
    imageIds: [],
    favorite: false,
  };

  const mockFormState = {
    name: "Updated Task Name",
    description: "Updated description",
    deadline: "2025-02-02",
    imageIds: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the useTrello hook with all its functions
    (useTrello as jest.Mock).mockReturnValue({
      editTask: mockEditTask,
      uploadImage: mockUploadImage,
      getImageById: mockGetImageById,
      addImageToTask: mockAddImageToTask,
    });

    // Mock the useForm hook with a specific state
    (useForm as jest.Mock).mockReturnValue({
      formState: mockFormState,
      handleChange: mockHandleChange,
    });

    // Mock the FileReader API to simulate a file upload
    jest.spyOn(window, "FileReader").mockImplementation(() => {
      const mockReader = {
        readAsDataURL: jest.fn(),
        onloadend: jest.fn(),
        result: "data:image/png;base64,mockImageData",
      };

      // Manually trigger the onloadend event
      Object.defineProperty(mockReader, "onloadend", {
        set(fn) {
          fn();
        },
      });
      return mockReader as unknown as FileReader;
    });
  });

  // Test 1: Initial rendering of the Edit button
  test("should render the Edit button and not the dialog initially", () => {
    render(<EditTask />);
    const editButton = screen.getByRole("button", { name: "edit" });
    expect(editButton).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Test 2: Opening the dialog when the Edit button is clicked
  test("should open the dialog when the Edit button is clicked", () => {
    render(
      <EditTask>
        <EditTaskForm task={mockTask} />
      </EditTask>,
    );
    const editButton = screen.getByRole("button", { name: "edit" });
    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByTestId(`mock-edit-task-form-${mockTask.id}`),
    ).toBeInTheDocument();
  });
});
