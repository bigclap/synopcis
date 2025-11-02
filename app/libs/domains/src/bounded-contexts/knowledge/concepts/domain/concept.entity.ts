import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Label } from './label.entity';

export enum ConceptType {
  CATEGORY = 'category',
  PROPERTY = 'property',
  VALUE = 'value',
}

@Entity('concepts')
export class Concept {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer', nullable: true })
  parent_id?: number;

  @ManyToOne(() => Concept, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent?: Concept;

  @Column({ type: 'varchar', unique: true })
  key!: string;

  @Column({ type: 'enum', enum: ConceptType })
  type!: ConceptType;

  @Column({ type: 'vector', nullable: true })
  vector?: unknown;

  @OneToMany(() => Label, (label) => label.concept)
  labels!: Label[];
}
