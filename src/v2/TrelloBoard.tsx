import { Stack } from "@mui/material";
import { ColumnList } from "./ColumnList.tsx";
import { TrelloProvider } from "./TrelloProvider.tsx";
import { AddColumn } from "./AddColumn.tsx";

export const TrelloBoard = () => {
  return (
    <TrelloProvider>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <ColumnList />
        <AddColumn />
      </Stack>
    </TrelloProvider>
  );
};
