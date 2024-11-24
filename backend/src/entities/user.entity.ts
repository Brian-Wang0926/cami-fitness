import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // 將這個類標記為資料庫實體
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
