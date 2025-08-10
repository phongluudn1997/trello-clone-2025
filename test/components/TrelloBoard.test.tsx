import { render } from "@testing-library/react";
import { TrelloBoard } from "../../src/components/TrelloBoard";
import { ColumnList } from "../../src/components/ColumnList";
import { AddColumn } from "../../src/components/AddColumn";

jest.mock("../../src/components/ColumnList", () => ({
  ColumnList: jest.fn(({ columnId }) => (
    <div data-testid={`mock-columnList-${columnId}`}>Mock Column List</div>
  )),
}));

jest.mock("../../src/components/AddColumn", () => ({
  AddColumn: jest.fn(({ columnId }) => (
    <div data-testid={`mock-addColumn-${columnId}`}>Mock Add Column</div>
  )),
}));

describe("TrelloBoard", () => {
  test("Should render Column List and AddColumn component", () => {
    render(<TrelloBoard />);
    expect(ColumnList).toHaveBeenCalledTimes(1);
    expect(AddColumn).toHaveBeenCalledTimes(1);
  });
});
