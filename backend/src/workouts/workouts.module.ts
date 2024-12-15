// backend/src/workouts/workouts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { SessionExercise } from '../entities/session-exercise.entity';
import { ExerciseSet } from '../entities/exercise-set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionExercise, ExerciseSet])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
