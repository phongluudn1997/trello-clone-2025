import { Stack, Typography } from "@mui/material";
import { TaskList } from "./TaskList.tsx";
import { AddTask } from "./AddTask.tsx";
import { SortButton } from "./SortButton.tsx";

import { ColumnData } from "../common/types/columnData";

export const Column = ({ id, name, sort }: ColumnData) => {
  return (
    <Stack width={300} spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <SortButton columnId={id} sort={sort} />
      </Stack>
      <TaskList columnId={id} />
      <AddTask columnId={id} />
    </Stack>
  );
};
