// frontend/src/components/WorkoutSchedule/SortableExerciseItem.tsx
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Paper,
  Typography,
  Box,
  Collapse,
  IconButton,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// 型別
import { WorkoutExercise } from "@/types/workout";

// 子組件
import { SetTableHeader } from "./SetTableHeader";
import { WorkoutSetItem } from "./WorkoutSetItem";

import { useWorkoutSets } from "@/hooks/useWorkoutSets";
import { useDraggable } from "@/hooks/useDraggable";

interface Props {
  exercise: WorkoutExercise;
  onUpdateExercise: (
    exerciseId: string,
    updatedData: Partial<WorkoutExercise>
  ) => void;
  onDeleteExercise: (exerciseId: string) => Promise<void>;
  isEditMode: boolean;
}

const defaultDuration = "90";

export function SortableExerciseItem({
  exercise,
  onUpdateExercise,
  onDeleteExercise,
  isEditMode,
}: Props) {
  const { sensors, handleDragEnd } = useDraggable();
  // 拖曳邏輯
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: exercise.id,
    });

  // 本地狀態
  const [expanded, setExpanded] = useState(false);

  // 使用自定義 hook 管理運動組數
  const { sets, addSet, removeSet, updateSet, moveSets, getExerciseInfo } =
    useWorkoutSets(exercise.setsData || [], (newSets) => {
      onUpdateExercise(exercise.id, { setsData: newSets });
    });

  // 樣式
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  const exerciseInfo = getExerciseInfo();

  const isRestExercise = exercise.name === "休息";

  const handleSetDragEnd = (event: DragEndEvent) => {
    handleDragEnd(event, sets, "set", (oldIndex, newIndex) =>
      moveSets(oldIndex, newIndex)
    );
  };

  console.log("Current exercise sets:", sets);

  // 新增休息組的樣式
  const paperStyles = isRestExercise
    ? {
        p: 2,
        mb: 1,
        bgcolor: "background.paper",
        border: "1px dashed grey.400",
        color: "text.primary",
        "&:hover": {
          bgcolor: "background.default",
        },
      }
    : {
        p: 2,
        mb: 1,
        bgcolor: "grey.900",
        color: "white",
        "&:hover": {
          bgcolor: "grey.800",
        },
      };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isRestExercise ? 0 : 2}
      sx={paperStyles}
    >
      {/* 運動卡片標題列 */}
      <Box display="flex" alignItems="center">
        {isEditMode && (
          <>
            <Box {...attributes} {...listeners} sx={{ cursor: "grab" }}>
              <DragIndicatorIcon />
            </Box>
            <IconButton
              color="error"
              onClick={() => onDeleteExercise(exercise.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}

        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            {isRestExercise ? (
              <AccessTimeIcon sx={{ mr: 1 }} />
            ) : (
              <Typography
                component="span"
                sx={{
                  px: 1,
                  py: 0.5,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                  fontSize: "0.875rem",
                  mr: 2,
                }}
              >
                {exercise.equipment}
              </Typography>
            )}
            <Typography>{exercise.name}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {isRestExercise ? (
              <Typography>{sets[0]?.duration || 0}秒</Typography>
            ) : (
              <>
                <Typography>{exerciseInfo.sets}組</Typography>
                {exerciseInfo.weightRange && (
                  <Typography>{exerciseInfo.weightRange}</Typography>
                )}
                {exerciseInfo.repsRange && (
                  <Typography>{exerciseInfo.repsRange}</Typography>
                )}
              </>
            )}

            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
              sx={{ color: isRestExercise ? "text.primary" : "white" }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* 運動組數詳情 */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pl: 6 }}>
          {isRestExercise ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                type="number"
                size="small"
                value={sets[0]?.duration}
                onChange={(e) => {
                  // 直接使用 updateSet，傳入索引、欄位名和值
                  updateSet(0, "duration", e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">秒</InputAdornment>
                  ),
                }}
                disabled={!isEditMode}
              />
            </Box>
          ) : (
            // 原有的運動組數內容
            <>
              <SetTableHeader />

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSetDragEnd}
              >
                <SortableContext
                  items={sets.map((set) => set.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sets.map((set, index) => (
                    <WorkoutSetItem
                      key={set.id}
                      set={set}
                      index={index}
                      onRemove={removeSet}
                      onChange={updateSet}
                      onMove={moveSets}
                      isEditMode={isEditMode}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {isEditMode && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addSet}
                    variant="outlined"
                    sx={{ color: "white", borderColor: "white" }}
                  >
                    新增組數
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
