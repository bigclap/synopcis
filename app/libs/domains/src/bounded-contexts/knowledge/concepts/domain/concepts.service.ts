import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concept, ConceptType } from './concept.entity';
import { Label } from './label.entity';

@Injectable()
export class ConceptsDomainService {
  constructor(
    @InjectRepository(Concept)
    private readonly conceptsRepository: Repository<Concept>,
    @InjectRepository(Label)
    private readonly labelsRepository: Repository<Label>,
  ) {}

  async createConcept(
    key: string,
    type: 'category' | 'property' | 'value',
    parentId?: number,
  ): Promise<Concept> {
    const concept = this.conceptsRepository.create({
      key,
      type: type as ConceptType,
      parent_id: parentId,
    });
    return this.conceptsRepository.save(concept);
  }

  async addLabel(
    conceptId: number,
    langCode: string,
    text: string,
  ): Promise<Label> {
    const label = this.labelsRepository.create({
      concept_id: conceptId,
      lang_code: langCode,
      text,
    });
    return this.labelsRepository.save(label);
  }
}
