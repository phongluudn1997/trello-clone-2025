import { render, screen, fireEvent } from "@testing-library/react";
import { SortButton } from "../../src/components/SortButton";
import { useTrello } from "../../src/common/hooks/useTrello";
import "@testing-library/jest-dom";

jest.mock("../../src/common/hooks/useTrello");

describe("SortButton", () => {
  const mockSortTasks = jest.fn();
  const mockColumnId = "column-1";

  beforeEach(() => {
    jest.clearAllMocks();
    (useTrello as jest.Mock).mockReturnValue({
      sortTasks: mockSortTasks,
    });
  });

  test("should render the down arrow icon when sort is 'ASC'", () => {
    render(<SortButton columnId={mockColumnId} sort="ASC" />);
    const downArrowIcon = screen.getByTestId("KeyboardArrowDownIcon");
    expect(downArrowIcon).toBeInTheDocument();
  });

  test("should call sortTasks with 'DESC' when the down arrow icon is clicked", () => {
    render(<SortButton columnId={mockColumnId} sort="ASC" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockSortTasks).toHaveBeenCalledTimes(1);
    expect(mockSortTasks).toHaveBeenCalledWith({
      columnId: mockColumnId,
      sortDirection: "DESC",
    });
  });

  test("should render the up arrow icon when sort is 'DESC'", () => {
    render(<SortButton columnId={mockColumnId} sort="DESC" />);
    const upArrowIcon = screen.getByTestId("KeyboardArrowUpIcon");
    expect(upArrowIcon).toBeInTheDocument();
  });

  test("should call sortTasks with 'ASC' when the up arrow icon is clicked", () => {
    render(<SortButton columnId={mockColumnId} sort="DESC" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockSortTasks).toHaveBeenCalledTimes(1);
    expect(mockSortTasks).toHaveBeenCalledWith({
      columnId: mockColumnId,
      sortDirection: "ASC",
    });
  });

  test("should render the horizontal rule icon when sort is not 'ASC' or 'DESC'", () => {
    render(<SortButton columnId={mockColumnId} sort={null} />);
    const horizontalRuleIcon = screen.getByTestId("HorizontalRuleIcon");
    expect(horizontalRuleIcon).toBeInTheDocument();
  });

  // Test case 6: Clicks the "horizontal rule" icon and calls sortTasks with "ASC"
  test("should call sortTasks with 'ASC' when the horizontal rule icon is clicked", () => {
    render(<SortButton columnId={mockColumnId} sort={null} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockSortTasks).toHaveBeenCalledTimes(1);
    expect(mockSortTasks).toHaveBeenCalledWith({
      columnId: mockColumnId,
      sortDirection: "ASC",
    });
  });
});
