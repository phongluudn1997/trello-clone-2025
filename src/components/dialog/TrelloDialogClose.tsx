import { PropsWithChildren } from "react";
import { useTrelloDialog } from "./useTrelloDialog";

export const TrelloDialogClose = ({ children }: PropsWithChildren) => {
  const { setIsOpen } = useTrelloDialog();
  const handleCloseDialog = () => setIsOpen(false);
  return (
    <div
      onClick={handleCloseDialog}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      {children}
    </div>
  );
};
