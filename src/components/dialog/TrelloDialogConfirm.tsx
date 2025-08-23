import { PropsWithChildren } from "react";
import { useTrelloDialog } from "./useTrelloDialog";

type TrelloDialogConfirmProps = PropsWithChildren & {
  onConfirm: () => Promise<void>;
};

export const TrelloDialogConfirm = ({
  onConfirm,
  children,
}: TrelloDialogConfirmProps) => {
  const { setIsOpen } = useTrelloDialog();
  const handleConfirm = async () => {
    await onConfirm();
    setIsOpen(false);
  };
  return (
    <div
      onClick={handleConfirm}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      {children}
    </div>
  );
};
