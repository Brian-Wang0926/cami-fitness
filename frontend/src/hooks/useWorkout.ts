import { useState, useCallback } from "react";
import { WorkoutSection, WorkoutExercise } from "@/types/workout";
import { workoutService } from "@/services/workoutService";

interface UseWorkoutReturn {
  sections: WorkoutSection[];
  isLoading: boolean;
  error: string | null;
  fetchWorkoutSchedule: () => Promise<void>;
  updateExercise: (
    exerciseId: string,
    updatedData: Partial<WorkoutExercise>
  ) => void;
  addExerciseToSection: (
    exercise: WorkoutExercise,
    sectionId: string
  ) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  updateWorkoutOrder: (newSections: WorkoutSection[]) => void;
  saveWorkout: (sections: WorkoutSection[]) => Promise<void>;
}

export const useWorkout = (): UseWorkoutReturn => {
  const [sections, setSections] = useState<WorkoutSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 取得運動計畫
  const fetchWorkoutSchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await workoutService.getWorkoutSchedule();
      // 使用型別斷言確保 data 符合 WorkoutSection[] 型別
      setSections(data as WorkoutSection[]);
    } catch (error) {
      console.error("Failed to fetch workout schedule:", error);
      setError("載入課表失敗");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 更新單一運動項目
  const updateExercise = useCallback(
    (exerciseId: string, updatedData: Partial<WorkoutExercise>) => {
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          exercises: section.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? { ...exercise, ...updatedData }
              : exercise
          ),
        }))
      );
    },
    []
  );

  // 新增運動至區塊
  const addExerciseToSection = async (
    exercise: WorkoutExercise,
    sectionId: string
  ) => {
    try {
      setIsLoading(true);
      await workoutService.addExerciseToWorkout(sectionId, exercise);
      await fetchWorkoutSchedule();
    } catch (error) {
      setError("新增動作失敗");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除運動
  const deleteExercise = async (exerciseId: string) => {
    try {
      setIsLoading(true);
      await workoutService.deleteExercise(exerciseId);
      await fetchWorkoutSchedule();
    } catch (error) {
      setError("刪除動作失敗");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 更新運動順序
  const updateWorkoutOrder = useCallback((newSections: WorkoutSection[]) => {
    setSections(newSections);
  }, []);

  // 儲存整個運動計畫
  const saveWorkout = async (sections: WorkoutSection[]) => {
    try {
      setIsLoading(true);
      const formattedSections = sections.map((section) => ({
        id: section.id,
        title: section.title,
        exercises: section.exercises.map((exercise, index) => ({
          id: exercise.id,
          order: index,
          setsData: exercise.setsData,
        })),
      }));

      await workoutService.updateWorkoutSchedule(formattedSections);
      await fetchWorkoutSchedule();
    } catch (error) {
      setError("儲存失敗");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sections,
    isLoading,
    error,
    fetchWorkoutSchedule,
    updateExercise,
    addExerciseToSection,
    deleteExercise,
    updateWorkoutOrder,
    saveWorkout,
  };
};
