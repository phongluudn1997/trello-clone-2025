import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useTrello } from "../common/hooks/useTrello";

import { TrelloDialogProvider } from "./dialog/TrelloDialogProvider";
import { TrelloDialogTrigger } from "./dialog/TrelloDialogTrigger";
import { TrelloDialog } from "./dialog/TrelloDialog";
import { TrelloDialogClose } from "./dialog/TrelloDialogClose";
import { TrelloDialogConfirm } from "./dialog/TrelloDialogConfirm";

interface DeleteTaskProps {
  taskId: string;
  columnId: string;
}

export const DeleteTask = ({ taskId, columnId }: DeleteTaskProps) => {
  const { deleteTask } = useTrello();
  const handleDelete = async () => {
    deleteTask({ taskId, columnId });
  };
  return (
    <TrelloDialogProvider>
      <TrelloDialogTrigger>
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </TrelloDialogTrigger>
      <TrelloDialog>
        <DialogContent>
          <Typography>Are you sure want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <TrelloDialogClose>
            <Button>Cancel</Button>
          </TrelloDialogClose>
          <TrelloDialogConfirm onConfirm={handleDelete}>
            <Button variant="contained">Yes</Button>
          </TrelloDialogConfirm>
        </DialogActions>
      </TrelloDialog>
    </TrelloDialogProvider>
  );
};
