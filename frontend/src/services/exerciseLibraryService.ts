import { api } from "@/lib/api";
import {
  ExerciseLibrary,
  ExerciseLibraryResponse,
  CreateExerciseLibrary,
} from "@/types/exerciseLibrary";

export const exerciseLibraryService = {
  getExercisesLibrary: (category?: string) => {
    return api.get<ExerciseLibraryResponse>(
      `api/exercisesLibrary${category ? `?category=${category}` : ""}`
    );
  },

  createExerciseLibrary: (exerciseData: CreateExerciseLibrary) => {
    console.log("Calling createExercise API", exerciseData);
    return api.post<ExerciseLibrary>("api/exercisesLibrary", exerciseData);
  },

  updateExerciseLibrary: (id: number, data: Partial<ExerciseLibrary>) =>
    api.put<ExerciseLibrary>(`api/exercisesLibrary/${id}`, data),

  deleteExerciseLibrary: (id: number) =>
    api.delete<void>(`api/exercisesLibrary/${id}`),
};
