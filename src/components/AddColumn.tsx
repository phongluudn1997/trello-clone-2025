import { Box, Button, IconButton, TextField } from "@mui/material";
import type { FormEvent } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTrello } from "../common/hooks/useTrello";
import { useForm } from "../common/hooks/useForm";
import { useToggle } from "../common/hooks/useToggle";

export const AddColumn = () => {
  const { addColumn } = useTrello();
  const [isFormOpen, toggleForm] = useToggle();
  const { formState, handleChange, reset } = useForm({ name: "" });

  if (!isFormOpen) {
    return (
      <Box width={300}>
        <Button variant="outlined" onClick={toggleForm} fullWidth>
          Add Column
        </Button>
      </Box>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addColumn({ name: formState.name });
    reset();
    toggleForm();
  };

  const handleClose = () => {
    reset();
    toggleForm();
  };

  return (
    <Box width={300}>
      <form onSubmit={handleSubmit} role="form">
        <TextField
          label="Name"
          fullWidth
          required
          onChange={handleChange}
          name="name"
          value={formState.name}
        />
        <Box>
          <Button type="submit">Submit</Button>
          <IconButton onClick={handleClose} aria-label="cancel">
            <CancelIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};
