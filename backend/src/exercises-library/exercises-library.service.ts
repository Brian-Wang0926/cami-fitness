import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseLibrary } from '../entities/exercise-library.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesLibraryService {
  private readonly logger = new Logger(ExercisesLibraryService.name);

  constructor(
    @InjectRepository(ExerciseLibrary)
    private exercisesRepository: Repository<ExerciseLibrary>,
  ) {}

  async findAll(category?: string) {
    const queryBuilder = this.exercisesRepository
      .createQueryBuilder('exerciseLibrary')
      .where('exerciseLibrary.is_deleted = :isDeleted', { isDeleted: false });

    if (category) {
      queryBuilder.andWhere('exerciseLibrary.category = :category', {
        category,
      });
    }

    const exercisesLibrary = await queryBuilder.getMany();
    return { exercisesLibrary };
  }

  async create(createExerciseDto: CreateExerciseDto, userId: number) {
    const exerciseLibrary = this.exercisesRepository.create({
      ...createExerciseDto,
      created_by: userId,
      is_deleted: false,
    });

    return await this.exercisesRepository.save(exerciseLibrary);
  }

  async delete(id: number) {
    // 使用軟刪除
    const result = await this.exercisesRepository.update(
      { exercise_id: id },
      { is_deleted: true },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    return { success: true };
  }

  async update(
    id: number,
    updateExerciseDto: UpdateExerciseDto,
    userId: number,
  ) {
    // 先檢查動作是否存在且屬於該用戶
    const exerciseLibrary = await this.exercisesRepository.findOne({
      where: {
        exercise_id: id,
        created_by: userId,
        is_deleted: false,
      },
    });

    if (!exerciseLibrary) {
      throw new NotFoundException('動作不存在或無權限修改');
    }

    // 更新動作
    const updatedExercise = {
      ...exerciseLibrary,
      ...updateExerciseDto,
      updated_at: new Date(),
    };

    try {
      const result = await this.exercisesRepository.save(updatedExercise);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update exercise: ${error.message}`);
      throw new InternalServerErrorException('更新動作失敗');
    }
  }
}

/*
4. 新增課程動作
5. 查詢所有課程動作
6. 查詢單筆課程動作
7. 修改課程動作
8. 刪除課程動作
*/
