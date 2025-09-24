import { Module } from '@nestjs/common';
import { GitSyncDomainService } from './domain/git-sync.service';

@Module({
  providers: [GitSyncDomainService],
  exports: [GitSyncDomainService],
})
export class GitSyncDomainModule {}
