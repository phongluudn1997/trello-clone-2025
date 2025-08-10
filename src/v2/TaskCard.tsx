import type { TaskData } from "./TrelloProvider.tsx";
import {
  ButtonGroup,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTrello } from "./useTrello.ts";
import { EditTask } from "./EditTask.tsx";
import NotesIcon from "@mui/icons-material/Notes";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface TaskCardProps {
  task: TaskData;
  columnId: string;
}

export const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { deleteTask, toggleFavorite } = useTrello();

  const handleDeleteTask = () => {
    deleteTask({ taskId: task.id, columnId });
  };

  const handleToggleFavorite = () => {
    toggleFavorite({ taskId: task.id });
  };

  return (
    <Card>
      <CardHeader
        title={<Typography>{task.name}</Typography>}
        action={
          <ButtonGroup size="small">
            <IconButton onClick={handleToggleFavorite}>
              {task.favorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
            <EditTask task={task} />
            <IconButton onClick={handleDeleteTask}>
              <DeleteIcon />
            </IconButton>
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
