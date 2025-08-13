import React from "react";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { Dialog, IconButton } from "@mui/material";
import { useState } from "react";
import { MoveTaskForm } from "./MoveTaskForm";

export interface MoveTaskProps {
  taskId: string;
  columnId: string;
}

export const MoveTask = (props: MoveTaskProps) => {
  const [isOpen, setIsModelOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsModelOpen(true);
  };

  const handleCloseDialog = () => {
    setIsModelOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleOpenDialog} aria-label="moveTask">
        <DriveFileMoveIcon />
      </IconButton>
      <Dialog open={isOpen} fullWidth onClose={handleCloseDialog}>
        <MoveTaskForm {...props} onClose={handleCloseDialog} />
      </Dialog>
    </div>
  );
};
