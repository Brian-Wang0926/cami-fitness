import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionExercise } from '../entities/session-exercise.entity';
import { ExerciseSet } from '../entities/exercise-set.entity';
import { UpdateWorkoutDto } from './dto/update-workout-exercise.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(SessionExercise)
    private sessionExerciseRepository: Repository<SessionExercise>,
    @InjectRepository(ExerciseSet)
    private exerciseSetRepository: Repository<ExerciseSet>,
  ) {}

  async getWorkoutSchedule() {
    const sessionExercises = await this.sessionExerciseRepository
      .createQueryBuilder('se')
      .leftJoinAndSelect('se.exerciseLibrary', 'el')
      .leftJoinAndSelect('se.exerciseSets', 'sets')
      .orderBy('se.order', 'ASC')
      .addOrderBy('sets.order', 'ASC')
      .getMany();

    console.log(
      'Raw session exercises:',
      JSON.stringify(sessionExercises, null, 2),
    ); // 加入這行來檢查原始資料

    const groupedExercises = sessionExercises.reduce((acc, exercise) => {
      if (!exercise.exerciseLibrary) {
        return acc;
      }

      const category = exercise.exerciseLibrary.category;
      const sectionId = category.toLowerCase().replace(/\s+/g, '-');

      if (!acc[sectionId]) {
        acc[sectionId] = {
          id: sectionId,
          title: `${category} - ${this.calculateDuration(category)} min`,
          exercises: [],
        };
      }

      // 確保有預設的組數資料
      const setsData =
        exercise.exerciseSets?.length > 0
          ? exercise.exerciseSets.map((set) => ({
              id: `${exercise.id}-set-${set.id}`,
              weight: set.weight || '',
              reps: set.reps || '',
              duration: set.duration || '',
              fatigue: set.fatigue || '',
            }))
          : [
              {
                // 如果沒有組數資料，創建一個預設組
                id: `${exercise.id}-set-0`,
                fatigue: '',
              },
            ];

      acc[sectionId].exercises.push({
        id: exercise.id.toString(),
        name: exercise.exerciseLibrary.name,
        category: exercise.exerciseLibrary.category,
        equipment: exercise.exerciseLibrary.equipment.split(','),
        setsData: setsData,
      });

      return acc;
    }, {});

    const result = Object.values(groupedExercises);
    console.log('Grouped exercises:', JSON.stringify(result, null, 2)); // 加入這行來檢查最終資料
    return result;
  }
  private calculateDuration(category: string): number {
    // 簡單的時間計算邏輯，可以根據需求調整
    const durationMap = {
      基本: 30.5,
      運動技巧: 45,
      肌力: 30,
      收操: 15,
    };
    return durationMap[category] || 30;
  }

  async updateWorkoutSchedule(updateWorkoutDto: UpdateWorkoutDto) {
    // 開啟交易
    await this.sessionExerciseRepository.manager.transaction(
      async (manager) => {
        // 更新每個動作的順序
        for (const section of updateWorkoutDto.sections) {
          for (const [index, exercise] of section.exercises.entries()) {
            const sessionExercise = await manager.findOne(SessionExercise, {
              where: { id: parseInt(exercise.id) },
            });

            if (sessionExercise) {
              sessionExercise.order = index;
              await manager.save(SessionExercise, sessionExercise);

              // 刪除舊的組數資料
              await manager.delete(ExerciseSet, {
                session_exercise_id: sessionExercise.id,
              });

              // 新增新的組數資料
              const sets = exercise.setsData.map((set, setIndex) => ({
                session_exercise_id: sessionExercise.id,
                weight: set.weight,
                reps: set.reps,
                duration: set.duration,
                fatigue: set.fatigue,
                order: setIndex,
              }));

              await manager.save(ExerciseSet, sets);
            }
          }
        }
      },
    );

    return this.getWorkoutSchedule();
  }

  async addExerciseToWorkout(sectionId: string, exerciseId: number) {
    try {
      // 1. 先根據肌群類別獲取該類別的最大順序值
      const maxOrderResult = await this.sessionExerciseRepository
        .createQueryBuilder('se')
        .leftJoin('se.exerciseLibrary', 'el')
        .where('el.category = :category', {
          category: sectionId, // 直接使用 sectionId 作為類別
        })
        .select('MAX(se.order)', 'maxOrder')
        .getRawOne();

      const nextOrder = (maxOrderResult?.maxOrder || -1) + 1;

      // 2. 創建新的運動紀錄
      const newSessionExercise = this.sessionExerciseRepository.create({
        exercise_id: exerciseId,
        order: nextOrder,
        session_id: 6,
      });

      // 3. 儲存新運動
      await this.sessionExerciseRepository.save(newSessionExercise);

      // 4. 回傳更新後的課表
      return this.getWorkoutSchedule();
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw new Error('Failed to add exercise');
    }
  }

  async deleteExercise(exerciseId: number) {
    try {
      // 使用交易來確保數據一致性
      await this.sessionExerciseRepository.manager.transaction(
        async (manager) => {
          // 先刪除相關的所有組數
          await manager.delete(ExerciseSet, {
            session_exercise_id: exerciseId,
          });

          // 再刪除運動本身
          await manager.delete(SessionExercise, {
            id: exerciseId,
          });
        },
      );

      // 返回更新後的課表
      return this.getWorkoutSchedule();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw new Error('Failed to delete exercise');
    }
  }
}
