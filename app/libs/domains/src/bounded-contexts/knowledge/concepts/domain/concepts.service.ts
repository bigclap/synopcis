import { Inject, Injectable } from '@nestjs/common';
import {
  CONCEPT_POLICIES,
  CONCEPT_REPOSITORY,
  ConceptAggregate,
  ConceptPolicies,
  ConceptRepository,
  CreateConceptCommand,
  MergeConceptsCommand,
  UpdateConceptCommand,
  UpdateConceptVectorCommand,
} from './concepts.domain.entity';

@Injectable()
export class ConceptsDomainService {
  constructor(
    @Inject(CONCEPT_REPOSITORY)
    private readonly repository: ConceptRepository,
    @Inject(CONCEPT_POLICIES)
    private readonly policies: ConceptPolicies,
  ) {}

  async create(command: CreateConceptCommand): Promise<ConceptAggregate> {
    // TODO: implement concept creation logic
    throw new Error('ConceptsDomainService.create not implemented');
  }

  async update(command: UpdateConceptCommand): Promise<ConceptAggregate> {
    // TODO: implement concept update logic
    throw new Error('ConceptsDomainService.update not implemented');
  }

  async merge(command: MergeConceptsCommand): Promise<ConceptAggregate> {
    // TODO: implement concept merge logic
    throw new Error('ConceptsDomainService.merge not implemented');
  }

  async updateVector(
    command: UpdateConceptVectorCommand,
  ): Promise<ConceptAggregate> {
    // TODO: implement vector update logic
    throw new Error('ConceptsDomainService.updateVector not implemented');
  }
}
