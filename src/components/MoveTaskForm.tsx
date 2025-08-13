import { MoveTaskProps } from "./MoveTask";
import { useTrello } from "../common/hooks/useTrello";
import { FormEvent, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";

interface MoveTaskFormProps extends MoveTaskProps {
  onClose: () => void;
}

export const MoveTaskForm = ({
  columnId,
  taskId,
  onClose,
}: MoveTaskFormProps) => {
  const { columns, moveTask, selectColumnById } = useTrello();
  const column = selectColumnById(columnId);
  const taskIndex = column.taskIds.indexOf(taskId);
  const [formState, setFormState] = useState({
    targetColumnId: columnId,
    targetIndex: taskIndex.toString(),
  });

  const handleColumnChange = (event: SelectChangeEvent) => {
    const newColumnId = event.target.value;
    const newColumn = selectColumnById(newColumnId);

    /**
     * Calculates the target index for moving a task
     * If same column, prefer current index
     * If different column, prefer last index (after added)
     */
    const lastIndex =
      newColumn.id === column.id ? taskIndex : newColumn.taskIds.length;

    setFormState({
      targetColumnId: newColumnId,
      targetIndex: lastIndex.toString(),
    });
  };

  const handleIndexChange = (event: SelectChangeEvent) => {
    setFormState((formState) => ({
      ...formState,
      targetIndex: event.target.value,
    }));
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

  /**
   * Return Array like of range of options for targetIndex
   * If targetColumn is current column, same array length - same number of tasks
   * If targetColumn is different, array length + 1 - since we add new task to this targetColumn
   */
  const targetIndexOptions = () => {
    const targetColumn = selectColumnById(formState.targetColumnId);
    const targetColumnTasks = targetColumn.taskIds.length;
    return Array.from({
      length:
        targetColumn.id === column.id
          ? targetColumnTasks
          : targetColumnTasks + 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} role="form">
      <DialogContent style={{ paddingTop: 20 }}>
        <Stack direction="row" spacing={2}>
          <Select
            label="Target Column"
            value={formState.targetColumnId}
            name="targetColumnId"
            onChange={handleColumnChange}
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
            onChange={handleIndexChange}
          >
            {targetIndexOptions().map((_, index) => (
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
