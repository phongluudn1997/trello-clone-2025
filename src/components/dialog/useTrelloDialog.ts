import { useContext } from "react";
import { TrelloDialogContext } from "./TrelloDialogContext";

export const useTrelloDialog = () => {
  const value = useContext(TrelloDialogContext);
  if (!value) {
    throw new Error("useTrelloDialog must be used inside TrelloDialogProvider");
  }
  return value;
};
