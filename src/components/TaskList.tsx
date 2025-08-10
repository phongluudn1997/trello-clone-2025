import { useTrello } from "../common/hooks/useTrello.ts";
import { Stack } from "@mui/material";
import { TaskCard } from "./TaskCard.tsx";

export const TaskList = ({ columnId }: { columnId: string }) => {
  const { tasksByColumnId } = useTrello();
  const tasks = tasksByColumnId(columnId);
  return (
    <Stack spacing={2}>
      {tasks.map((task) => (
        <TaskCard key={task.id} columnId={columnId} task={task} />
      ))}
    </Stack>
  );
};
