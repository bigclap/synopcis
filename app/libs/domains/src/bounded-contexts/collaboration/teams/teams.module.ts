import { Module } from '@nestjs/common';
import { TeamsDomainService } from './domain/teams.service';

@Module({
  providers: [TeamsDomainService],
  exports: [TeamsDomainService],
})
export class TeamsDomainModule {}
