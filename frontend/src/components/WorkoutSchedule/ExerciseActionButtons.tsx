import { IconButton, Box, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExerciseLibrary } from "@/types/exerciseLibrary";

interface ExerciseActionButtonsProps {
  exercise: ExerciseLibrary;
  onView: (exercise: ExerciseLibrary) => void;
  onEdit: (exercise: ExerciseLibrary) => void;
  onDelete: (exercise: ExerciseLibrary) => void;
}

export function ExerciseActionButtons({
  exercise,
  onView,
  onEdit,
  onDelete,
}: ExerciseActionButtonsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        right: 8,
        top: 8,
      }}
    >
      <Tooltip title="查看詳細" placement="left">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onView(exercise);
          }}
          sx={{
            mb: 0.5,
            color: "rgba(0, 0, 0, 0.3)",
            "&:hover": {
              color: "rgba(0, 0, 0, 0.6)",
              backgroundColor: "transparent",
            },
          }}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="編輯" placement="left">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(exercise);
          }}
          sx={{
            mb: 0.5,
            color: "rgba(0, 0, 0, 0.3)",
            "&:hover": {
              color: "rgba(0, 0, 0, 0.6)",
              backgroundColor: "transparent",
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="刪除" placement="left">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(exercise);
          }}
          sx={{
            color: "rgba(0, 0, 0, 0.3)",
            "&:hover": {
              color: "rgba(0, 0, 0, 0.6)",
              backgroundColor: "transparent",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
