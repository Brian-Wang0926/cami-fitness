import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ExerciseLibrary {
  @PrimaryGeneratedColumn()
  exercise_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  equipment: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20 })
  difficulty_level: string;

  @Column({ length: 50 })
  muscle_group: string;

  @Column({ length: 20 })
  category: string; // 'basic' | 'strength' | 'cardio'

  @Column({ length: 255, nullable: true })
  video_url: string;

  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
