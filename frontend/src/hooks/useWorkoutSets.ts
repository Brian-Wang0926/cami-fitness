// frontend/src/hooks/useWorkoutSets.ts
import { useState, useCallback } from "react";
import { WorkoutSet } from "@/types/workout";

interface ExerciseInfo {
  sets: number;
  weightRange: string;
  repsRange: string;
}

export function useWorkoutSets(
  initialSets: WorkoutSet[],
  onChange: (sets: WorkoutSet[]) => void
) {
  const [sets, setSets] = useState<WorkoutSet[]>(initialSets);

  // 添加新組數
  const addSet = useCallback(() => {
    const newSet: WorkoutSet = {
      id: `set-${Date.now()}`,
      weight: sets[sets.length - 1]?.weight || "",
      reps: sets[sets.length - 1]?.reps || "",
      duration: sets[sets.length - 1]?.duration || "",
      fatigue: "",
    };
    const newSets = [...sets, newSet];
    setSets(newSets);
    onChange(newSets);
  }, [sets, onChange]);

  // 移除組數
  const removeSet = useCallback(
    (index: number) => {
      const newSets = sets.filter((_, i) => i !== index);
      setSets(newSets);
      onChange(newSets);
    },
    [sets, onChange]
  );

  // 更新組數資料
  const updateSet = useCallback(
    (index: number, field: keyof WorkoutSet, value: string) => {
      const newSets = sets.map((set, i) => {
        if (i === index) {
          return { ...set, [field]: value };
        }
        return set;
      });
      setSets(newSets);
      onChange(newSets);
    },
    [sets, onChange]
  );

  // 移動組數順序
  const moveSets = useCallback(
    (oldIndex: number, newIndex: number) => {
      const newSets = [...sets];
      const [removed] = newSets.splice(oldIndex, 1);
      newSets.splice(newIndex, 0, removed);
      setSets(newSets);
      onChange(newSets);
    },
    [sets, onChange]
  );

  // 取得運動資訊
  const getExerciseInfo = useCallback((): ExerciseInfo => {
    const weights = sets
      .map((set) => Number(set.weight))
      .filter((w) => !isNaN(w));
    const reps = sets.map((set) => Number(set.reps)).filter((r) => !isNaN(r));

    return {
      sets: sets.length,
      weightRange:
        weights.length > 0
          ? `${Math.min(...weights)}~${Math.max(...weights)}kg`
          : "",
      repsRange:
        reps.length > 0 ? `${Math.min(...reps)}~${Math.max(...reps)}次` : "",
    };
  }, [sets]);

  return {
    sets,
    addSet,
    removeSet,
    updateSet,
    moveSets,
    getExerciseInfo,
  };
}
