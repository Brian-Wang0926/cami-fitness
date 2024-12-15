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
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

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
    useWorkoutSets(exercise.setsData, (newSets) => {
      onUpdateExercise(exercise.id, { setsData: newSets });
    });

  // 樣式
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  const exerciseInfo = getExerciseInfo();

  const handleSetDragEnd = (event: DragEndEvent) => {
    handleDragEnd(event, sets, "set", (oldIndex, newIndex) =>
      moveSets(oldIndex, newIndex)
    );
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={2}
      sx={{
        p: 2,
        mb: 1,
        bgcolor: "grey.900",
        color: "white",
        "&:hover": {
          bgcolor: "grey.800",
        },
        transition: "background-color 0.2s",
      }}
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
            <Typography>{exercise.name}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography>{exerciseInfo.sets}組</Typography>
            {exerciseInfo.weightRange && (
              <Typography>{exerciseInfo.weightRange}</Typography>
            )}
            {exerciseInfo.repsRange && (
              <Typography>{exerciseInfo.repsRange}</Typography>
            )}

            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
              sx={{ color: "white" }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* 運動組數詳情 */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pl: 6 }}>
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
        </Box>
      </Collapse>
    </Paper>
  );
}
