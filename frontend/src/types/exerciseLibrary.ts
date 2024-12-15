export interface ExerciseLibrary {
  exercise_id: string;
  name: string;
  equipment: string;
  description?: string;
  difficulty_level: string;
  muscle_group: string;
  category: string;
  video_url?: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
}

export interface ExerciseLibrarySection {
  id: string;
  title: string;
  exercises: ExerciseLibrary[];
}

export interface ExerciseLibraryResponse {
  exercisesLibrary: ExerciseLibrary[];
}

export interface CreateExerciseLibrary {
  name: string;
  equipment: string;
  muscle_group: string;
  description: string;
  difficulty_level: string;
  category: string;
  video_url?: string;
}
