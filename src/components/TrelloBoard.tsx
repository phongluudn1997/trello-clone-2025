import { Stack } from "@mui/material";
import { ColumnList } from "./ColumnList";
import { TrelloProvider } from "../providers/TrelloProvider";
import { AddColumn } from "./AddColumn";

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
