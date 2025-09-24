import { Module } from '@nestjs/common';
import { ConceptsDomainService } from './domain/concepts.service';

@Module({
  providers: [ConceptsDomainService],
  exports: [ConceptsDomainService],
})
export class ConceptsDomainModule {}
