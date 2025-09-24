import { Module } from '@nestjs/common';
import { VotingDomainService } from './domain/voting.service';

@Module({
  providers: [VotingDomainService],
  exports: [VotingDomainService],
})
export class VotingDomainModule {}
