import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { IconButton } from "@mui/material";
import { useTrello } from "../common/hooks/useTrello";

import { TaskData } from "../common/types/taskData";

interface FavoriteButtonProps {
  task: TaskData;
}

export const FavoriteButton = ({ task }: FavoriteButtonProps) => {
  const { toggleFavorite } = useTrello();

  const handleToggleFavorite = () => {
    toggleFavorite({ taskId: task.id });
  };

  return (
    <IconButton onClick={handleToggleFavorite}>
      {task.favorite ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
};
