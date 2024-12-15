// backend/src/database/seeds/create-default-exercises.seed.ts
import { DataSource } from 'typeorm';
import { ExerciseLibrary } from '../../entities/exercise-library.entity';

export const createDefaultExercises = async (dataSource: DataSource) => {
  const ExerciseLibraryRepository = dataSource.getRepository(ExerciseLibrary);

  // 檢查預設動作是否已存在
  const existingExercise = await ExerciseLibraryRepository.findOne({
    where: { name: '槓鈴深蹲' },
  });

  if (!existingExercise) {
    const defaultExercises = [
      {
        name: '槓鈴深蹲',
        equipment: '槓鈴',
        muscle_group: '腿部',
        description:
          '標準槓鈴深蹲動作要領：1.槓鈴置於上背部 2.雙腳與肩同寬 3.緩慢下蹲至大腿平行地面 4.穩定上升回到起始位置',
        difficulty_level: 'intermediate',
        category: '肌力',
      },
      {
        name: '槓鈴臥推',
        equipment: '槓鈴',
        muscle_group: '胸部',
        description:
          '標準槓鈴臥推動作要領：1.平躺臥推凳 2.握距與肩同寬 3.槓鈴緩慢下降至胸部 4.推回起始位置',
        difficulty_level: 'intermediate',
        category: '肌力',
      },
      // 可以繼續添加更多預設動作...
    ];

    for (const exerciseLibrary of defaultExercises) {
      const newExercise = ExerciseLibraryRepository.create(exerciseLibrary);
      await ExerciseLibraryRepository.save(newExercise);
    }

    console.log('Default exercises created successfully');
  } else {
    console.log('Default exercises already exist');
  }
};
