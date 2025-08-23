import { PropsWithChildren } from "react";
import { useTrelloDialog } from "./useTrelloDialog";

export const TrelloDialogTrigger = ({ children }: PropsWithChildren) => {
  const { setIsOpen } = useTrelloDialog();
  const handleOpenDialog = () => {
    setIsOpen(true);
  };
  return (
    <div
      style={{ cursor: "pointer", display: "inline-block" }}
      onClick={handleOpenDialog}
    >
      {children}
    </div>
  );
};
