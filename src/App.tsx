import "./App.css";
import { TrelloBoard } from "./components/TrelloBoard";
import { ErrorBoundaryProvider } from "./providers/error-boundary/ErrorBoundaryProvider";
import { TrelloProvider } from "./providers/trello/TrelloProvider";

function App() {
  return (
    <ErrorBoundaryProvider>
      <TrelloProvider>
        <TrelloBoard />
      </TrelloProvider>
    </ErrorBoundaryProvider>
  );
}

export default App;
