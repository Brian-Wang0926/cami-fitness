import { api } from "@/lib/api";

export const workoutService = {
  getWorkoutSchedule: () => {
    return api.get("api/workouts");
  },
  updateWorkoutSchedule: (sections: any) => {
    // 確保按照後端期望的格式傳送資料
    const payload = {
      sections: sections.map((section) => ({
        id: section.id,
        title: section.title,
        exercises: section.exercises.map((exercise) => ({
          id: exercise.id,
          order: exercise.order,
          setsData: exercise.setsData.map((set) => ({
            id: set.id,
            weight: set.weight,
            reps: set.reps,
            duration: set.duration,
            fatigue: set.fatigue,
          })),
        })),
      })),
    };

    console.log("Sending update payload:", payload);
    return api.put("api/workouts", payload);
  },

  // 新增動作到課表的方法
  addExerciseToWorkout: (sectionId: string, exercise: any) => {
    console.log("Sending request:", {
      sectionId,
      exercise_id: exercise.exercise_id,
    });

    return api.post(`api/workouts/sections/${sectionId}/exercises`, {
      exercise_id: Number(exercise.exercise_id),
    });
  },

  deleteExercise: (exerciseId: string) => {
    return api.delete(`api/workouts/exercises/${exerciseId}`);
  },
};
