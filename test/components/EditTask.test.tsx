import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { EditTask } from "../../src/components/EditTask";
import { useTrello } from "../../src/common/hooks/useTrello";
import { useForm } from "../../src/common/hooks/useForm";
import "@testing-library/jest-dom";

// Mock the custom hooks to control their behavior during the test.
jest.mock("../../src/common/hooks/useTrello");
jest.mock("../../src/common/hooks/useForm");

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
    render(<EditTask task={mockTask} />);
    const editButton = screen.getByRole("button", { name: "edit" });
    expect(editButton).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // Test 2: Opening the dialog when the Edit button is clicked
  test("should open the dialog when the Edit button is clicked", () => {
    render(<EditTask task={mockTask} />);
    const editButton = screen.getByRole("button", { name: "edit" });
    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  // Test 3: Closing the dialog when the Close button is clicked
  test("should close the dialog when the Close button is clicked", async () => {
    render(<EditTask task={mockTask} />);
    const editButton = screen.getByRole("button", { name: "edit" });
    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    const form = screen.getByRole("form");
    await waitForElementToBeRemoved(form);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  // Test 4: Form submission triggers editTask and closes the dialog
  test("should call editTask with updated form data and close the dialog on save", async () => {
    render(<EditTask task={mockTask} />);
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);

    expect(mockEditTask).toHaveBeenCalledTimes(1);
    expect(mockEditTask).toHaveBeenCalledWith({
      taskId: mockTask.id,
      updatedTask: mockFormState,
    });
    const form = screen.getByRole("form");
    await waitForElementToBeRemoved(form);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  // Test 5: Image upload handler is called and hooks are used correctly
  test("should call uploadImage and addImageToTask when a file is uploaded", () => {
    render(<EditTask task={mockTask} />);
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const uploadInput = screen.getByLabelText("Upload files");
    const file = new File(["test image"], "test.png", { type: "image/png" });

    // Simulate file upload
    fireEvent.change(uploadInput, { target: { files: [file] } });

    // Assert that the image upload and add functions were called
    expect(mockUploadImage).toHaveBeenCalledTimes(1);
    expect(mockUploadImage).toHaveBeenCalledWith({
      fileName: file.name,
      base64Url: "data:image/png;base64,mockImageData",
    });

    expect(mockAddImageToTask).toHaveBeenCalledTimes(1);
    expect(mockAddImageToTask).toHaveBeenCalledWith({
      imageId: "image-1",
      taskId: mockTask.id,
    });
  });
});
