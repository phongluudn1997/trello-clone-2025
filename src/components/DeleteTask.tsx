import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useTrello } from "../common/hooks/useTrello";

interface DeleteTaskProps {
  taskId: string;
  columnId: string;
}

export const DeleteTask = ({ taskId, columnId }: DeleteTaskProps) => {
  const { deleteTask } = useTrello();

  const handleDeleteTask = () => {
    deleteTask({ taskId, columnId });
  };

  return (
    <IconButton onClick={handleDeleteTask} aria-label="delete">
      <DeleteIcon />
    </IconButton>
  );
};
