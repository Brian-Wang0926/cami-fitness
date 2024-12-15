import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  equipment: string;

  @IsString()
  @IsNotEmpty()
  muscle_group: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty_level: string;

  @IsString()
  @IsEnum(['basic', 'strength', 'cardio'])
  category: string;

  @IsString()
  @IsOptional()
  video_url?: string;
}
