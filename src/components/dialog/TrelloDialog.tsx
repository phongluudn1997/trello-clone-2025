import { PropsWithChildren } from "react";
import { Dialog } from "@mui/material";
import { useTrelloDialog } from "./useTrelloDialog";

export const TrelloDialog = ({ children }: PropsWithChildren) => {
  const { isOpen } = useTrelloDialog();
  return <Dialog open={isOpen}>{children}</Dialog>;
};
