import { Inject, Injectable } from '@nestjs/common';
import {
  FEED_TIMELINE_REPOSITORY,
  BuildFeedCommand,
  FeedTimelineEntry,
  FeedTimelineRepository,
  MarkFeedEntryReadCommand,
} from './feed.domain.entity';

@Injectable()
export class FeedDomainService {
  constructor(
    @Inject(FEED_TIMELINE_REPOSITORY)
    private readonly repository: FeedTimelineRepository,
  ) {}

  async build(command: BuildFeedCommand): Promise<readonly FeedTimelineEntry[]> {
    // TODO: implement feed building logic
    throw new Error('FeedDomainService.build not implemented');
  }

  async markRead(command: MarkFeedEntryReadCommand): Promise<void> {
    // TODO: implement feed mark read logic
    throw new Error('FeedDomainService.markRead not implemented');
  }
}
