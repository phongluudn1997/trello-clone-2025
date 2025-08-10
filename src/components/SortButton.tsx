import { useTrello } from "../common/hooks/useTrello.ts";
import { IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

import { SortDirection } from "../common/types/sortDirection";

interface SortButtonProps {
  columnId: string;
  sort: SortDirection;
}

export const SortButton = ({ columnId, sort }: SortButtonProps) => {
  const { sortTasks } = useTrello();

  if (sort === "ASC") {
    return (
      <IconButton
        onClick={() => sortTasks({ columnId, sortDirection: "DESC" })}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
    );
  }

  if (sort === "DESC") {
    return (
      <IconButton onClick={() => sortTasks({ columnId, sortDirection: "ASC" })}>
        <KeyboardArrowUpIcon />
      </IconButton>
    );
  }

  return (
    <IconButton onClick={() => sortTasks({ columnId, sortDirection: "ASC" })}>
      <HorizontalRuleIcon />
    </IconButton>
  );
};
