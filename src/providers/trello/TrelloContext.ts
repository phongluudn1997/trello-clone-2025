import { createContext } from "react";
import { TrelloContextValue } from "../../common/types/trelloActions";

export const TrelloContext = createContext<TrelloContextValue | undefined>(
  undefined,
);
