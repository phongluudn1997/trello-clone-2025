import { useTrello } from "./useTrello.ts";
import { Button } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import type { SortDirection } from "./TrelloProvider.tsx";

interface SortButtonProps {
  columnId: string;
  sort: SortDirection;
}

export const SortButton = ({ columnId, sort }: SortButtonProps) => {
  const { sortTasks } = useTrello();

  if (sort === "ASC") {
    return (
      <Button onClick={() => sortTasks({ columnId, sortDirection: "DESC" })}>
        <KeyboardArrowDownIcon />
      </Button>
    );
  }

  if (sort === "DESC") {
    return (
      <Button onClick={() => sortTasks({ columnId, sortDirection: "ASC" })}>
        <KeyboardArrowUpIcon />
      </Button>
    );
  }

  return (
    <Button onClick={() => sortTasks({ columnId, sortDirection: "ASC" })}>
      <HorizontalRuleIcon />
    </Button>
  );
};
