import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Request,
  Logger,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ExercisesLibraryService } from './exercises-library.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercisesLibrary')
export class ExercisesLibraryController {
  private readonly logger = new Logger(ExercisesLibraryController.name);

  constructor(
    private readonly exercisesLibraryService: ExercisesLibraryService,
  ) {}

  @Get()
  async getExercises(@Query('category') category?: string) {
    return this.exercisesLibraryService.findAll(category);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createExerciseDto: CreateExerciseDto, @Request() req) {
    const { userId } = req.user;
    return await this.exercisesLibraryService.create(createExerciseDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    return await this.exercisesLibraryService.delete(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Request() req,
  ) {
    const { userId } = req.user;
    return await this.exercisesLibraryService.update(
      id,
      updateExerciseDto,
      userId,
    );
  }
}
