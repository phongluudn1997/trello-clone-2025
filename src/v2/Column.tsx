import { Stack, Typography } from "@mui/material";
import { TaskList } from "./TaskList.tsx";
import type { ColumnData } from "./TrelloProvider.tsx";
import { AddTask } from "./AddTask.tsx";

export const Column = ({ id, name }: ColumnData) => {
  return (
    <Stack width={300} spacing={2}>
      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>
      <TaskList columnId={id} />
      <AddTask columnId={id} />
    </Stack>
  );
};
