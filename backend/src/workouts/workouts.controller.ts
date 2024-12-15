import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { UpdateWorkoutDto } from './dto/update-workout-exercise.dto';
import { CreateWorkoutExerciseDto } from './dto/create-workout-exercise.dto';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  async getWorkoutSchedule() {
    return await this.workoutsService.getWorkoutSchedule();
  }

  @Put()
  async updateWorkoutSchedule(@Body() updateDto: UpdateWorkoutDto) {
    try {
      console.log('Received update data:', updateDto); // 印出接收到的資料
      return await this.workoutsService.updateWorkoutSchedule(updateDto);
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  @Post('sections/:sectionId/exercises')
  async addExerciseToWorkout(
    @Param('sectionId') sectionId: string,
    @Body() createDto: CreateWorkoutExerciseDto,
  ) {
    try {
      console.log('Received request:', {
        sectionId,
        createDto,
        body: createDto.exercise_id,
      });

      return await this.workoutsService.addExerciseToWorkout(
        sectionId,
        createDto.exercise_id,
      );
    } catch (error) {
      console.error('Add exercise error:', error);
      throw error;
    }
  }

  @Delete('exercises/:exerciseId')
  async deleteExercise(@Param('exerciseId') exerciseId: string) {
    try {
      return await this.workoutsService.deleteExercise(Number(exerciseId));
    } catch (error) {
      console.error('Delete exercise error:', error);
      throw error;
    }
  }
}
