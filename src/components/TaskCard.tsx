import type { TaskData } from "../providers/TrelloProvider.tsx";
import {
  ButtonGroup,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTrello } from "../common/hooks/useTrello.ts";
import { EditTask } from "./EditTask.tsx";
import NotesIcon from "@mui/icons-material/Notes";
import { MoveTask } from "./MoveTask.tsx";
import { FavoriteButton } from "./FavoriteButton.tsx";

interface TaskCardProps {
  task: TaskData;
  columnId: string;
}

export const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { deleteTask } = useTrello();

  const handleDeleteTask = () => {
    deleteTask({ taskId: task.id, columnId });
  };

  return (
    <Card>
      <CardHeader
        title={<Typography>{task.name}</Typography>}
        action={
          <ButtonGroup size="small">
            <FavoriteButton task={task} />
            <EditTask task={task} />
            <IconButton onClick={handleDeleteTask} aria-label="delete">
              <DeleteIcon />
            </IconButton>
            <MoveTask taskId={task.id} columnId={columnId} />
          </ButtonGroup>
        }
      />
      {task.description && (
        <CardActions>
          <NotesIcon />
        </CardActions>
      )}
    </Card>
  );
};
