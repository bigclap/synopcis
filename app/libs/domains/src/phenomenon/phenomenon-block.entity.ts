import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PhenomenonEntity } from './phenomenon.entity';

@Entity({ name: 'phenomenon_blocks' })
export class PhenomenonBlockEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PhenomenonEntity, (phenomenon) => phenomenon.blocks)
  phenomenon: PhenomenonEntity;

  @Column()
  path: string;

  @Column()
  title: string;

  @Column()
  level: number;
}
