import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'achievements' })
export class AchievementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  icon: string;
}
