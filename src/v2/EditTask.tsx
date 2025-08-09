import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTrello } from "./useTrello.ts";
import { useToggle } from "../common/hooks/useToggle.ts";
import { type FormEvent, useState } from "react";
import type { TaskData } from "./TrelloProvider.tsx";
import { useForm } from "../common/hooks/useForm.ts";

interface EditTaskProps {
  task: TaskData;
}

export const EditTask = ({ task }: EditTaskProps) => {
  const { editTask } = useTrello();
  const [isOpen, setIsModelOpen] = useState(false);
  const [isEditMode, toggleEditMode] = useToggle();
  const { formState, handleChange } = useForm(task);

  const handleOpenDialog = () => {
    setIsModelOpen(true);
  };

  const handleCloseDialog = () => {
    setIsModelOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    editTask({
      taskId: task.id,
      updatedTask: formState,
    });
    handleCloseDialog();
  };

  return (
    <div>
      <IconButton onClick={handleOpenDialog}>
        <EditIcon />
      </IconButton>
      <Dialog open={isOpen} fullWidth onClose={handleCloseDialog}>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between">
              {isEditMode ? (
                <TextField
                  label="Name"
                  fullWidth
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                />
              ) : (
                task.name
              )}
              {!isEditMode && <Button onClick={toggleEditMode}>Edit</Button>}
            </Stack>
          </DialogTitle>
          <DialogContent>
            {isEditMode ? (
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={formState.description}
                onChange={handleChange}
                multiline
                maxRows={4}
              />
            ) : (
              <Typography>{task.description}</Typography>
            )}
          </DialogContent>
          {isEditMode && (
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          )}
        </Box>
      </Dialog>
    </div>
  );
};
