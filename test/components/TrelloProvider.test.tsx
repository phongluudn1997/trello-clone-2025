import { render, screen } from "@testing-library/react";
import { TrelloProvider } from "../../src/providers/trello/TrelloProvider";
import { TrelloBoard } from "../../src/components/TrelloBoard";
import { ErrorBoundaryProvider } from "../../src/providers/error-boundary/ErrorBoundaryProvider";

describe("TrelloProvider", () => {
  test("Handle add column", () => {
    render(
      <ErrorBoundaryProvider>
        <TrelloProvider>
          <TrelloBoard />
        </TrelloProvider>
      </ErrorBoundaryProvider>,
    );
    screen.debug();
  });
});
