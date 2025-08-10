import { useTrello } from "../common/hooks/useTrello.ts";
import { Stack } from "@mui/material";
import { Column } from "./Column.tsx";

export const ColumnList = () => {
  const { columns } = useTrello();
  return (
    <Stack direction="row" spacing={2}>
      {columns.map((column) => (
        <Column key={column.id} {...column} />
      ))}
    </Stack>
  );
};
