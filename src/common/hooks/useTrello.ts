import { useContext } from "react";
import { TrelloContext } from "../../providers/trello/TrelloContext";

export const useTrello = () => {
  const value = useContext(TrelloContext);
  if (!value) {
    throw new Error("Only use useTrello inside TrelloProvider");
  }
  return value;
};
