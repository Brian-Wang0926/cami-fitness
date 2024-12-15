import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SessionExercise } from './session-exercise.entity';

@Entity('exercise_sets')
export class ExerciseSet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session_exercise_id: number;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  reps: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  fatigue: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => SessionExercise)
  @JoinColumn({ name: 'session_exercise_id' })
  sessionExercise: SessionExercise;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
