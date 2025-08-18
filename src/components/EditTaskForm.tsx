import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { TrelloDialogClose } from "./dialog/TrelloDialogClose";
import { TrelloDialogConfirm } from "./dialog/TrelloDialogConfirm";
import type { ChangeEvent } from "react";
import { getFileReaderResults } from "../common/utils/fileReader";
import { useTrello } from "../common/hooks/useTrello";
import { useForm } from "../common/hooks/useForm";
import { useErrorBoundary } from "react-error-boundary";
import { TaskData } from "../common/types/taskData";

interface EditTaskFormProps {
  task: TaskData;
}

export const EditTaskForm = ({ task }: EditTaskFormProps) => {
  const { formState, setFormState, handleChange } = useForm(task);
  const { editTask, uploadImages, getImageById } = useTrello();
  const { showBoundary } = useErrorBoundary();

  const handleSubmit = async () => {
    editTask({
      taskId: task.id,
      updatedTask: formState,
    });
  };

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && !!files.length) {
      try {
        const fileReaderResults = await getFileReaderResults(files);
        const imageIds = uploadImages(fileReaderResults);
        setFormState((formState) => ({
          ...formState,
          imageIds: [...formState.imageIds, ...imageIds],
        }));
      } catch (error) {
        showBoundary(error);
      }
    }
  };
  return (
    <>
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
                  multiple
                  onChange={handleFilesChange}
                />
              </Button>
            </Stack>

            <List>
              {formState.imageIds.map((imageId) => {
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
      </Box>
      <DialogActions>
        <TrelloDialogClose>
          <Button>Close</Button>
        </TrelloDialogClose>
        <TrelloDialogConfirm onConfirm={handleSubmit}>
          <Button>Save</Button>
        </TrelloDialogConfirm>
      </DialogActions>
    </>
  );
};
