import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from "@mui/material";
import { type FormEvent, useState } from "react";
import { useTrello } from "../common/hooks/useTrello.ts";

interface MoveTaskProps {
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
        {isOpen && <MoveTaskForm {...props} onClose={handleCloseDialog} />}
      </Dialog>
    </div>
  );
};

interface MoveTaskFormProps extends MoveTaskProps {
  onClose: () => void;
}

export const MoveTaskForm = ({
  columnId,
  taskId,
  onClose,
}: MoveTaskFormProps) => {
  const { columns, moveTask } = useTrello();
  const column = columns.find((column) => column.id === columnId);
  const defaultTargetIndex = column?.taskIds.indexOf(taskId).toString();

  const [formState, setFormState] = useState(() => {
    return {
      targetColumnId: columnId,
      targetIndex: defaultTargetIndex,
    };
  });

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    if (name === "targetColumnId") {
      const selectedColumn = columns.find((column) => column.id === value);
      const targetIndex = selectedColumn?.taskIds.length
        ? (selectedColumn.taskIds.length - 1).toString()
        : "0";

      setFormState({
        targetColumnId: value,
        targetIndex,
      });
    } else {
      setFormState((formState) => ({ ...formState, [name]: value }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    moveTask({
      taskId,
      sourceColumnId: columnId,
      targetColumnId: formState.targetColumnId,
      targetIndex: Number(formState.targetIndex),
    });

    onClose();
  };
  const getTaskIndexOptions = () => {
    const column = columns.find(
      (column) => column.id === formState.targetColumnId,
    );
    if (!column?.taskIds.length) {
      return [""];
    }
    return column.taskIds;
  };
  return (
    <form onSubmit={handleSubmit} role="form">
      <DialogContent style={{ paddingTop: 20 }}>
        <Stack direction="row" spacing={2}>
          <Select
            label="Target Column"
            value={formState.targetColumnId}
            name="targetColumnId"
            onChange={handleChange}
          >
            {columns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Position"
            name="targetIndex"
            value={formState.targetIndex}
            onChange={handleChange}
          >
            {getTaskIndexOptions().map((_, index) => (
              <MenuItem key={index} value={index.toString()}>
                {index}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </form>
  );
};
