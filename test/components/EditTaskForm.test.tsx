import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EditTaskForm } from "../../src/components/EditTaskForm";
import { useTrello } from "../../src/common/hooks/useTrello";
import { useTrelloDialog } from "../../src/components/dialog/useTrelloDialog";
import * as fileReaderUtils from "../../src/common/utils/fileReader";

jest.mock("../../src/common/hooks/useTrello");
jest.mock("../../src/components/dialog/useTrelloDialog");

describe("EditTaskForm", () => {
  const mockTask = {
    id: "task-1",
    name: "Initial Task Name",
    description: "Initial description",
    deadline: "2025-01-01",
    imageIds: [],
    favorite: false,
  };

  const mockUploadImages = jest.fn();
  const mockEditTask = jest.fn();
  const mockSetIsOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTrello as jest.Mock).mockReturnValue({
      editTask: mockEditTask,
      uploadImages: mockUploadImages,
      getImageById: jest.fn(),
    });
    (useTrelloDialog as jest.Mock).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
    });
  });

  test("renders correctly with given task", () => {
    render(<EditTaskForm task={mockTask} />);
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue(
      mockTask.name,
    );
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      mockTask.description,
    );
    expect(screen.getByLabelText(/deadline/i)).toHaveValue(mockTask.deadline);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /upload files/i }),
    ).toBeInTheDocument();
  });

  test("submits the form with updated values", async () => {
    render(<EditTaskForm task={mockTask} />);
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Updated Task Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(mockEditTask).toHaveBeenCalledWith({
      taskId: mockTask.id,
      updatedTask: expect.objectContaining({ name: "Updated Task Name" }),
    });
  });

  test("calls uploadImages and updates imageIds on file upload", async () => {
    mockUploadImages.mockReturnValue(["image-1"]);
    const fileReaderSpy = jest.spyOn(fileReaderUtils, "getFileReaderResults");
    render(<EditTaskForm task={mockTask} />);
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText(/upload files/i);
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(fileReaderSpy).toHaveBeenCalled());
    await waitFor(() => expect(mockUploadImages).toHaveBeenCalled());
  });

  test("calls closeDialog when close button is clicked", async () => {
    render(<EditTaskForm task={mockTask} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
});
