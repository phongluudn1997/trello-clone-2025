import React, { PropsWithChildren } from "react";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { IconButton } from "@mui/material";
import { TrelloDialogProvider } from "./dialog/TrelloDialogProvider";
import { TrelloDialogTrigger } from "./dialog/TrelloDialogTrigger";
import { TrelloDialog } from "./dialog/TrelloDialog";

export interface MoveTaskProps {
  taskId: string;
  columnId: string;
}

export const MoveTask = ({ children }: PropsWithChildren) => {
  return (
    <TrelloDialogProvider>
      <TrelloDialogTrigger>
        <IconButton aria-label="moveTask">
          <DriveFileMoveIcon />
        </IconButton>
      </TrelloDialogTrigger>

      <TrelloDialog>{children}</TrelloDialog>
    </TrelloDialogProvider>
  );
};
