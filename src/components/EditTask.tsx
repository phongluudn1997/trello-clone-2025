import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { PropsWithChildren } from "react";
import { TrelloDialogTrigger } from "./dialog/TrelloDialogTrigger";
import { TrelloDialog } from "./dialog/TrelloDialog";
import { TrelloDialogProvider } from "./dialog/TrelloDialogProvider";

export const EditTask = ({ children }: PropsWithChildren) => {
  return (
    <TrelloDialogProvider>
      <TrelloDialogTrigger>
        <IconButton aria-label="edit">
          <EditIcon />
        </IconButton>
      </TrelloDialogTrigger>
      <TrelloDialog>{children}</TrelloDialog>
    </TrelloDialogProvider>
  );
};
