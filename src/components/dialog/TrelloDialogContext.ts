import { createContext } from "react";

export const TrelloDialogContext = createContext<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}>(undefined);
