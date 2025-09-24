import {
  DomainEvent,
  PaginatedResult,
  Query,
  RepositoryPort,
  UUID,
  UseCase,
} from '../../../../core';
import { ArticleId } from '../../knowledge/articles/domain/articles.domain.entity';
import { BlockId } from '../../knowledge/blocks/domain/blocks.domain.entity';

export type FeedEventId = string;

export type FeedEventType =
  | 'article.published'
  | 'block.alternative.won'
  | 'discussion.started'
  | 'duel.completed'
  | 'user.achievement.unlocked';

export interface FeedEventPayload {
  readonly articleId?: ArticleId;
  readonly blockId?: BlockId;
  readonly actorId?: UUID;
  readonly metadata?: Record<string, unknown>;
}

export interface FeedEvent extends DomainEvent<FeedEventPayload> {
  readonly type: FeedEventType;
}

export interface FeedTimelineEntry {
  readonly id: FeedEventId;
  readonly recipientId: UUID;
  readonly event: FeedEvent;
  readonly deliveredAt: Date;
  readonly isRead: boolean;
}

export interface FeedTimelineRepository
  extends RepositoryPort<FeedTimelineEntry, FeedEventId> {
  loadTimeline(recipientId: UUID, query: Query): Promise<PaginatedResult<FeedTimelineEntry>>;
}

export const FEED_TIMELINE_REPOSITORY = Symbol('FEED_TIMELINE_REPOSITORY');

export interface BuildFeedCommand {
  readonly recipientId: UUID;
  readonly since?: Date;
}

export interface MarkFeedEntryReadCommand {
  readonly entryId: FeedEventId;
  readonly recipientId: UUID;
}

export interface FeedUseCases {
  readonly buildPersonalFeed: UseCase<BuildFeedCommand, PaginatedResult<FeedTimelineEntry>>;
  readonly markEntryRead: UseCase<MarkFeedEntryReadCommand, void>;
}

//TODO Integrate with subscription preferences and analytics weighting.
