// 運動組數的型別定義
export interface WorkoutSet {
  id: string;
  weight: string;
  reps: string;
  duration: string;
  fatigue: string;
}

// 運動項目型別
export interface WorkoutExercise {
  id: string; // 新增
  exercise_id: string; // 從 ExerciseLibrary 繼承
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
  setsData: WorkoutSet[];
}

// 運動區塊型別
export interface WorkoutSection {
  id: string;
  title: string;
  exercises: WorkoutExercise[];
}

// API 請求型別
export interface UpdateWorkoutRequest {
  sections: {
    id: string;
    title: string;
    exercises: {
      id: string;
      order: number;
      setsData: WorkoutSet[];
    }[];
  }[];
}
