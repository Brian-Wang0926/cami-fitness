// backend/src/database/seeds/create-default-session-exercises.seed.ts
import { DataSource } from 'typeorm';
import { Session } from '../../entities/session.entity';
import { SessionExercise } from '../../entities/session-exercise.entity';
import { ExerciseSet } from '../../entities/exercise-set.entity';

export const createDefaultSessionExercises = async (dataSource: DataSource) => {
  const sessionRepository = dataSource.getRepository(Session);
  const sessionExerciseRepository = dataSource.getRepository(SessionExercise);
  const exerciseSetRepository = dataSource.getRepository(ExerciseSet);

  // 創建測試課程
  const session = await sessionRepository.save({
    plan_id: 1001,
    subscription_id: 5001,
    scheduled_date: new Date('2024-03-15 09:00:00'),
    estimated_duration: 90,
    status: 'pending',
    original_coach_id: 201,
    coach_session_number: 5,
  });

  // 添加課程動作
  const sessionExercises = [
    {
      session_id: session.session_id,
      exercise_id: 1,
      order: 1,
      setsData: [
        { weight: '60', reps: '12', duration: '40', fatigue: '3', order: 0 },
        { weight: '60', reps: '12', duration: '50', fatigue: '3', order: 1 },
        { weight: '60', reps: '12', duration: '60', fatigue: '4', order: 2 },
      ],
    },
    {
      session_id: session.session_id,
      exercise_id: 2,
      order: 2,
      setsData: [
        { weight: '45', reps: '10', duration: '30', fatigue: '3', order: 0 },
        { weight: '45', reps: '10', duration: '30', fatigue: '3', order: 1 },
        { weight: '45', reps: '10', duration: '40', fatigue: '4', order: 2 },
      ],
    },
  ];

  for (const exerciseData of sessionExercises) {
    // 儲存運動
    const { setsData, ...exerciseLibrary } = exerciseData;
    const savedExercise = await sessionExerciseRepository.save(exerciseLibrary);

    // 儲存各組數據
    const sets = setsData.map((setData) => ({
      session_exercise_id: savedExercise.id,
      ...setData,
    }));
    await exerciseSetRepository.save(sets);
  }

  console.log('Default session exercises and sets created successfully');
};
