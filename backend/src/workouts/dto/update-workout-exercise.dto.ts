// backend/src/workouts/dto/update-workout-exercise.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class ExerciseSetDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  weight: string;

  @IsString()
  @IsOptional()
  reps: string;

  @IsString()
  @IsOptional()
  duration: string;

  @IsString()
  @IsOptional()
  fatigue: string;
}

export class WorkoutExerciseDto {
  @IsString()
  id: string;

  @IsNumber()
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseSetDto)
  setsData: ExerciseSetDto[];
}

export class WorkoutSectionDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];
}

export class UpdateWorkoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutSectionDto)
  sections: WorkoutSectionDto[];
}
