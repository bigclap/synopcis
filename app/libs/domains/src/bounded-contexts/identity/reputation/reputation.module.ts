import { Module } from '@nestjs/common';
import { ReputationDomainService } from './domain/reputation.service';

@Module({
  providers: [ReputationDomainService],
  exports: [ReputationDomainService],
})
export class ReputationDomainModule {}
