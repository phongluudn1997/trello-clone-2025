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
