// backend/src/entities/session.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SessionExercise } from './session-exercise.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  session_id: number;

  @Column()
  plan_id: number;

  @Column()
  subscription_id: number;

  @Column()
  scheduled_date: Date;

  @Column()
  estimated_duration: number;

  @Column({ length: 20 })
  status: string;

  @Column()
  original_coach_id: number;

  @Column({ nullable: true })
  actual_coach_id: number;

  @Column({ length: 20, nullable: true })
  substitute_type: string;

  @Column({ type: 'text', nullable: true })
  substitute_reason: string;

  @Column({ nullable: true })
  coach_session_number: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => SessionExercise,
    (sessionExercise) => sessionExercise.session,
  )
  sessionExercises: SessionExercise[];
}
