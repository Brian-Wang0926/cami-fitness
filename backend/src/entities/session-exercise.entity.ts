// backend/src/entities/session-exercise.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { ExerciseLibrary } from './exercise-library.entity';
import { ExerciseSet } from './exercise-set.entity';

@Entity('session_exercises')
export class SessionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session_id: number;

  @Column()
  exercise_id: number;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => ExerciseLibrary)
  @JoinColumn({ name: 'exercise_id' })
  exerciseLibrary: ExerciseLibrary;

  @OneToMany(() => ExerciseSet, (set) => set.sessionExercise)
  exerciseSets: ExerciseSet[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
