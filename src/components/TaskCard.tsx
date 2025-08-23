import {
  ButtonGroup,
  Card,
  CardActions,
  CardHeader,
  Typography,
} from "@mui/material";
import { EditTask } from "./EditTask";
import NotesIcon from "@mui/icons-material/Notes";
import { MoveTask } from "./MoveTask";
import { FavoriteButton } from "./FavoriteButton";
import { DeleteTask } from "./DeleteTask";

import { TaskData } from "../common/types/taskData";
import { MoveTaskForm } from "./MoveTaskForm";
import { EditTaskForm } from "./EditTaskForm";

interface TaskCardProps {
  task: TaskData;
  columnId: string;
}

export const TaskCard = ({ task, columnId }: TaskCardProps) => {
  return (
    <Card>
      <CardHeader
        title={<Typography>{task.name}</Typography>}
        action={
          <ButtonGroup size="small">
            <FavoriteButton task={task} />
            <EditTask>
              <EditTaskForm task={task} />
            </EditTask>
            <DeleteTask taskId={task.id} columnId={columnId} />
            <MoveTask>
              <MoveTaskForm taskId={task.id} columnId={columnId} />
            </MoveTask>
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
