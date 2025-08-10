import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteButton } from "../../src/components/FavoriteButton";
import { useTrello } from "../../src/common/hooks/useTrello";
import "@testing-library/jest-dom";

// Mock the useTrello hook to control its behavior
jest.mock("../../src/common/hooks/useTrello");

describe("FavoriteButton", () => {
  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTrello as jest.Mock).mockReturnValue({
      toggleFavorite: mockToggleFavorite,
    });
  });

  // Test case 1: Renders the StarBorderIcon when the task is not a favorite
  test("should render the outlined star icon when the task is not a favorite", () => {
    const mockTask = {
      id: "task-1",
      name: "Test Task",
      favorite: false,
      description: "",
      deadline: "",
      imageIds: [],
    };
    render(<FavoriteButton task={mockTask} />);

    // Use a test ID or a more specific selector if multiple buttons are present
    const starBorderIcon = screen.getByTestId("StarBorderIcon");
    expect(starBorderIcon).toBeInTheDocument();
  });

  // Test case 2: Renders the StarIcon when the task is a favorite
  test("should render the filled star icon when the task is a favorite", () => {
    const mockTask = {
      id: "task-1",
      name: "Test Task",
      favorite: true,
      description: "",
      deadline: "",
      imageIds: [],
    };
    render(<FavoriteButton task={mockTask} />);

    // Use a test ID to specifically target the filled star icon
    const starIcon = screen.getByTestId("StarIcon");
    expect(starIcon).toBeInTheDocument();
  });

  // Test case 3: Clicking the button calls toggleFavorite with the correct taskId
  test("should call toggleFavorite with the correct taskId when clicked", () => {
    const mockTask = {
      id: "task-1",
      name: "Test Task",
      favorite: false,
      description: "",
      deadline: "",
      imageIds: [],
    };
    render(<FavoriteButton task={mockTask} />);

    const favoriteButton = screen.getByRole("button");
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleFavorite).toHaveBeenCalledWith({ taskId: mockTask.id });
  });
});
