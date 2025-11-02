import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PhenomenonBlockEntity } from './phenomenon-block.entity';

@Entity({ name: 'phenomena' })
export class PhenomenonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => PhenomenonBlockEntity, (block) => block.phenomenon)
  blocks: PhenomenonBlockEntity[];
}
