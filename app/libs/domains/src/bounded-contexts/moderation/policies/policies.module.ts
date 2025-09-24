import { Module } from '@nestjs/common';
import { ModerationPoliciesDomainService } from './domain/policies.service';

@Module({
  providers: [ModerationPoliciesDomainService],
  exports: [ModerationPoliciesDomainService],
})
export class ModerationPoliciesDomainModule {}
