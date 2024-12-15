// frontend/src/components/WorkoutSchedule/WorkoutSetItem.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";

import { WorkoutSet } from "@/types/workout";

interface Props {
  set: WorkoutSet;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof WorkoutSet, value: string) => void;
  onMove: (oldIndex: number, newIndex: number) => void;
  isEditMode: boolean;
}

export function WorkoutSetItem({
  set,
  index,
  onRemove,
  onChange,
  isEditMode,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: set.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      backgroundColor: "grey.900",
      "&:hover": {
        backgroundColor: "grey.800",
      },
      "& fieldset": {
        borderColor: "grey.700",
      },
      "&.Mui-disabled": {
        color: "white",
        WebkitTextFillColor: "white",
        "& input": {
          color: "white",
          WebkitTextFillColor: "white",
        },
      },
      "& input": {
        color: "white",
        WebkitTextFillColor: "white",
      },
    },
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "grid",
        gridTemplateColumns: "30px 30px 60px 1fr 1fr 1fr 80px",
        gap: 1,
        mb: 1,
        alignItems: "center",
        pl: 1,
      }}
    >
      {isEditMode ? (
        <>
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: "grab",
              display: "flex",
              alignItems: "center",
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>
          <IconButton
            size="small"
            onClick={() => onRemove(index)}
            sx={{
              color: "white",
              padding: 0,
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ) : (
        <>
          <Box width="30px" />
          <Box width="30px" />
        </>
      )}

      {/* 組數編號 */}
      <Box>{index + 1}</Box>

      {/* 重量輸入框 */}
      <TextField
        size="small"
        value={set.weight}
        onChange={(e) => onChange(index, "weight", e.target.value)}
        placeholder="重量"
        disabled={!isEditMode}
        sx={textFieldStyle}
      />

      {/* 次數輸入框 */}
      <TextField
        size="small"
        value={set.reps}
        onChange={(e) => onChange(index, "reps", e.target.value)}
        placeholder="次數"
        disabled={!isEditMode}
        sx={textFieldStyle}
      />

      {/* 時間輸入框 */}
      <TextField
        size="small"
        value={set.duration}
        onChange={(e) => onChange(index, "duration", e.target.value)}
        placeholder="時間"
        disabled={!isEditMode}
        sx={textFieldStyle}
      />

      {/* 疲勞度選擇器 */}
      <FormControl size="small" fullWidth>
        <Select
          value={set.fatigue}
          onChange={(e) => onChange(index, "fatigue", e.target.value as string)}
          disabled={!isEditMode}
          sx={{
            color: "white",
            backgroundColor: "grey.900",
            "&:hover": {
              backgroundColor: "grey.800",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey.700",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
            "&.Mui-disabled": {
              color: "white",
              WebkitTextFillColor: "white",
              "-webkit-text-fill-color": "white !important",
            },
            "& .MuiSelect-select": {
              color: "white",
              WebkitTextFillColor: "white",
              "-webkit-text-fill-color": "white !important",
            },
          }}
        >
          <MenuItem value="">-</MenuItem>
          {[1, 2, 3, 4, 5].map((level) => (
            <MenuItem key={level} value={level.toString()}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
