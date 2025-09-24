import { Module } from '@nestjs/common';
import { DiscussionsDomainService } from './domain/discussions.service';

@Module({
  providers: [DiscussionsDomainService],
  exports: [DiscussionsDomainService],
})
export class DiscussionsDomainModule {}
