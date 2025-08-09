import { useToggle } from "../common/hooks/useToggle.ts";
import { Button, IconButton, TextField } from "@mui/material";
import type { FormEvent } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTrello } from "./useTrello.ts";
import { useForm } from "../common/hooks/useForm.ts";

interface AddTaskProps {
  columnId: string;
}

export const AddTask = ({ columnId }: AddTaskProps) => {
  const { addTask } = useTrello();
  const [isFormOpen, toggleForm] = useToggle();
  const { formState, handleChange, reset } = useForm({ name: "" });

  if (!isFormOpen) {
    return (
      <Button variant="outlined" onClick={toggleForm}>
        Add Task
      </Button>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addTask({
      columnId,
      name: formState.name,
    });
    reset();
    toggleForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Name"
        required
        onChange={handleChange}
        name="name"
        value={formState.name}
      />
      <br />
      <Button type="submit">Submit</Button>
      <IconButton onClick={toggleForm}>
        <CancelIcon />
      </IconButton>
    </form>
  );
};
