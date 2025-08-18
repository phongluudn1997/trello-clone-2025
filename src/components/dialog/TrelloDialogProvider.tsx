import { PropsWithChildren, useState } from "react";
import { TrelloDialogContext } from "./TrelloDialogContext";

export const TrelloDialogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TrelloDialogContext value={{ isOpen, setIsOpen }}>
      {children}
    </TrelloDialogContext>
  );
};
