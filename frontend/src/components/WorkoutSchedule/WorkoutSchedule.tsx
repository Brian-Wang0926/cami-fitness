// frontend/src/components/WorkoutSchedule/WorkoutSchedule.tsx
import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Typography, Container, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// 自定義 hooks
import { useWorkout } from "@/hooks/useWorkout";
import { useDraggable } from "@/hooks/useDraggable";

// 組件
import { SortableExerciseItem } from "./SortableExerciseItem";
import { ExerciseLibraryModal } from "./ExerciseLibraryModal";

// 型別
import { ExerciseLibrary } from "@/types/exerciseLibrary";
import { WorkoutExercise } from "@/types/workout";

// 定義固定的sections配置
const FIXED_SECTIONS = [
  { id: "basic", title: "熱身", type: "basic" as const },
  { id: "strength", title: "肌力", type: "strength" as const },
  { id: "cardio", title: "心肺", type: "cardio" as const },
];

export function WorkoutSchedule() {
  // 狀態管理
  const {
    sections,
    isLoading,
    error,
    fetchWorkoutSchedule,
    updateExercise,
    addExerciseToSection,
    deleteExercise,
    updateWorkoutOrder,
    saveWorkout,
  } = useWorkout();

  // 拖曳邏輯
  const { sensors } = useDraggable();

  // 本地狀態
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  // 追蹤當前選中的 section type
  const [selectedSectionType, setSelectedSectionType] = useState<
    "basic" | "strength" | "cardio"
  >("basic");

  // 初始載入
  useEffect(() => {
    fetchWorkoutSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Current sections:", sections);
  }, [sections]);

  // 取得所有運動項目 ID (用於拖曳)
  const exerciseIds = sections.flatMap((section) =>
    section.exercises.map((exercise) => exercise.id)
  );

  useEffect(() => {
    console.log("Exercise IDs:", exerciseIds);
  }, [exerciseIds]);

  // 處理開啟運動庫
  const handleOpenLibrary = (sectionId: string) => {
    const section = FIXED_SECTIONS.find((s) => s.id === sectionId);
    if (section) {
      setSelectedSectionType(section.type);
      setSelectedSectionId(sectionId);
      setIsLibraryOpen(true);
    }
  };

  // 處理新增運動
  const handleAddExerciseToWorkout = async (
    exercise: ExerciseLibrary,
    sectionId: string
  ) => {
    try {
      await addExerciseToSection(exercise as WorkoutExercise, sectionId);
      setIsLibraryOpen(false);
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  // 處理儲存
  const handleSave = async () => {
    try {
      await saveWorkout(sections);
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  // 處理取消
  const handleCancel = async () => {
    await fetchWorkoutSchedule();
    setIsEditMode(false);
  };

  if (isLoading) return <div>載入中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container maxWidth="md">
      {/* 控制按鈕 */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        {!isEditMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditMode(true)}
          >
            修改
          </Button>
        ) : (
          <Box display="flex" gap={2}>
            <Button variant="outlined" color="primary" onClick={handleCancel}>
              取消
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              儲存
            </Button>
          </Box>
        )}
      </Box>

      {/* 拖曳區域 */}
      {FIXED_SECTIONS.map((fixedSection) => {
        const sectionData = sections.find((s) => s.id === fixedSection.id) || {
          id: fixedSection.id,
          exercises: [],
        };

        return (
          <Box key={fixedSection.id} mb={4}>
            {/* Section 標題 */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">{fixedSection.title}</Typography>
              {isEditMode && (
                <IconButton
                  color="primary"
                  onClick={() => handleOpenLibrary(fixedSection.id)}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              )}
            </Box>

            {/* 為每個 section 創建獨立的 DndContext */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                // 只處理同一個 section 內的拖曳
                const { active, over } = event;
                if (!over) return;

                const exercises = sectionData.exercises;
                const oldIndex = exercises.findIndex(
                  (ex) => ex.id === active.id
                );
                const newIndex = exercises.findIndex((ex) => ex.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                  const newSections = sections.map((section) => {
                    if (section.id === fixedSection.id) {
                      return {
                        ...section,
                        exercises: arrayMove(exercises, oldIndex, newIndex),
                      };
                    }
                    return section;
                  });
                  updateWorkoutOrder(newSections);
                }
              }}
              modifiers={[restrictToParentElement]}
            >
              <SortableContext
                items={sectionData.exercises.map((ex) => ex.id)}
                strategy={verticalListSortingStrategy}
              >
                <Box
                  sx={{
                    border: "1px solid #eee",
                    borderRadius: 1,
                    p: 2,
                    minHeight: "50px",
                  }}
                >
                  {sectionData.exercises?.map((exercise) => (
                    <SortableExerciseItem
                      key={exercise.id}
                      exercise={exercise}
                      onUpdateExercise={updateExercise}
                      onDeleteExercise={deleteExercise}
                      isEditMode={isEditMode}
                    />
                  ))}
                </Box>
              </SortableContext>
            </DndContext>
          </Box>
        );
      })}
      {/* 運動庫 */}
      <ExerciseLibraryModal
        open={isLibraryOpen && isEditMode}
        onClose={() => setIsLibraryOpen(false)}
        onAddToWorkout={handleAddExerciseToWorkout}
        sections={sections}
        category={selectedSectionType}
        selectedSectionId={selectedSectionId}
        trainerId="1"
      />
    </Container>
  );
}
