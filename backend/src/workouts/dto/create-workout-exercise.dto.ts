import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWorkoutExerciseDto {
  @IsNumber()
  @IsNotEmpty()
  readonly exercise_id: number;
}
