import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Concept } from '../../concepts/domain/concept.entity';
import { User } from '../../../identity/domain/user.entity';

@Entity('article_concepts')
export class ArticleConcept {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  article_id!: number;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;

  @Column({ type: 'integer' })
  concept_id!: number;

  @ManyToOne(() => Concept, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'concept_id' })
  concept!: Concept;

  @Column({ type: 'integer', nullable: true })
  property_concept_id?: number;

  @ManyToOne(() => Concept, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'property_concept_id' })
  property_concept?: Concept;

  @Column({ type: 'text', nullable: true })
  source_url?: string;

  @Column({ type: 'integer' })
  author_id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
