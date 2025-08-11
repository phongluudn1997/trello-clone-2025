import {
  Avatar,
  Box,
  List,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemAvatar,
  Stack,
  TextField,
  ListItemText,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTrello } from "../common/hooks/useTrello";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useForm } from "../common/hooks/useForm";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { TaskData } from "../common/types/taskData";
import { useErrorBoundary } from "react-error-boundary";

interface EditTaskProps {
  task: TaskData;
}

export const EditTask = ({ task }: EditTaskProps) => {
  const { editTask, uploadImage, getImageById, addImageToTask } = useTrello();
  const [isOpen, setIsModelOpen] = useState(false);
  const { formState, handleChange } = useForm(task);
  const { showBoundary } = useErrorBoundary();

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

  /**
   * Upload image here, handle error of local storage exceed
   * @param event
   */
  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && !!files.length) {
      try {
        const file = files[0];
        const fileUrl = URL.createObjectURL(file);
        const imageId = uploadImage({
          fileName: file.name,
          base64Url: fileUrl,
        });
        addImageToTask({ imageId, taskId: task.id });
      } catch (error) {
        showBoundary(error);
      }
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpenDialog} aria-label="edit">
        <EditIcon />
      </IconButton>
      <Dialog open={isOpen} fullWidth onClose={handleCloseDialog}>
        <Box component="form" onSubmit={handleSubmit} role="form">
          <DialogTitle>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
          </DialogTitle>
          <DialogContent style={{ paddingTop: 20 }}>
            <Stack spacing={2}>
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={formState.description}
                onChange={handleChange}
                multiline
                maxRows={4}
              />

              <TextField
                label="Deadline"
                type="date"
                fullWidth
                name="deadline"
                value={formState.deadline}
                onChange={handleChange}
                // Prevent label overlap with Date placeholder
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <Stack direction="row" justifyContent="space-between">
                <Typography>Images</Typography>
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload files
                  <input
                    hidden
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={handleFilesChange}
                  />
                </Button>
              </Stack>

              <List>
                {task.imageIds.map((imageId) => {
                  const image = getImageById(imageId);
                  if (image) {
                    return (
                      <ListItem key={imageId}>
                        <ListItemAvatar>
                          <Avatar src={image.base64Url} />
                        </ListItemAvatar>
                        <ListItemText primary={image.fileName} />
                      </ListItem>
                    );
                  }
                  return null;
                })}
              </List>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};
