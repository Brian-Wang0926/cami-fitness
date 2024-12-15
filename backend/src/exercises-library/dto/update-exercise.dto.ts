import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  equipment?: string;

  @IsOptional()
  @IsString()
  muscle_group?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty_level?: string;

  @IsOptional()
  @IsEnum(['basic', 'strength', 'cardio'])
  category?: string;
}
