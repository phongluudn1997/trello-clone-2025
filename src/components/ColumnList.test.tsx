import { useTrello } from "../common/hooks/useTrello";
import { ColumnList } from "./ColumnList";
import { render, screen } from "@testing-library/react";
import { Column } from "./Column";
import { ColumnData } from "../providers/TrelloProvider";

jest.mock("../common/hooks/useTrello");

jest.mock("./Column", () => ({
  Column: jest.fn(({ id, name }) => (
    <div data-testid={`column-${id}`}>Column: {name}</div>
  )),
}));
const mockColumn = Column as jest.MockedFunction<typeof Column>;

describe("ColumnList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTrello as jest.Mock).mockReturnValue({
      columns: [],
    });
  });
  test("should render empty columns in the initial state", () => {
    render(<ColumnList />);
    expect(screen.queryByTestId(/column-/)).not.toBeInTheDocument();
    expect(mockColumn).not.toHaveBeenCalled();
  });

  test("should render multiple columns", () => {
    const multipleColumns: ColumnData[] = [
      { id: "column-1", name: "To Do", sort: undefined, taskIds: [] },
      { id: "column-2", name: "In Progress", sort: "ASC", taskIds: [] },
      { id: "column-3", name: "Done", sort: "DESC", taskIds: [] },
    ];

    (useTrello as jest.Mock).mockReturnValue({
      columns: multipleColumns,
    });

    render(<ColumnList />);

    // Check all columns are rendered
    expect(screen.getByTestId("column-column-1")).toBeInTheDocument();
    expect(screen.getByTestId("column-column-2")).toBeInTheDocument();
    expect(screen.getByTestId("column-column-3")).toBeInTheDocument();

    // Check column content
    expect(screen.getByText("Column: To Do")).toBeInTheDocument();
    expect(screen.getByText("Column: In Progress")).toBeInTheDocument();
    expect(screen.getByText("Column: Done")).toBeInTheDocument();

    expect(mockColumn).toHaveBeenCalledTimes(3);
  });
});
