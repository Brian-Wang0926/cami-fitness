import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity() // 將這個類標記為資料庫實體
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  // 添加 Google ID 欄位
  @Column({ nullable: true })
  google_id: string;

  @Column({ unique: true, length: 100 })
  email: string;

  // 密碼欄位為可選
  @Column({ length: 255, nullable: true })
  password_hash: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  birth: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;
}
