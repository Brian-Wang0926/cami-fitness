import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseLibrary } from '../entities/exercise-library.entity';
import { ExercisesLibraryService } from './exercises-library.service';
import { ExercisesLibraryController } from './exercises-library.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseLibrary])],
  providers: [ExercisesLibraryService],
  controllers: [ExercisesLibraryController],
})
export class ExercisesLibraryModule {}
