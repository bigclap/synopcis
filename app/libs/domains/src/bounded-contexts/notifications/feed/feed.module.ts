import { Module } from '@nestjs/common';
import { FeedDomainService } from './domain/feed.service';

@Module({
  providers: [FeedDomainService],
  exports: [FeedDomainService],
})
export class FeedDomainModule {}
