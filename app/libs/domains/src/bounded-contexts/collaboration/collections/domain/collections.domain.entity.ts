import {
  AggregateRoot,
  DomainEvent,
  Identifier,
  Ownership,
  PaginatedResult,
  RepositoryPort,
  UUID,
  UseCase,
  ValueObject,
} from '../../../../core';
import { ArticleId } from '../../knowledge/articles/domain/articles.domain.entity';

export type CollectionId = Identifier;

export interface CollectionProps {
  readonly title: string;
  readonly description?: string;
  readonly isPublic: boolean;
  readonly ownership: Ownership;
  readonly articles: readonly CollectionArticle[];
}

export interface CollectionArticle extends ValueObject<{ readonly articleId: ArticleId }> {
  readonly addedAt: Date;
  readonly addedBy: UUID;
  readonly order: number;
  readonly notes?: string;
}

export interface CollectionAggregate
  extends AggregateRoot<CollectionId, CollectionProps, CollectionEvent> {}

export type CollectionEvent =
  | CollectionCreatedEvent
  | CollectionArticleAddedEvent
  | CollectionArticleRemovedEvent
  | CollectionVisibilityChangedEvent;

export interface CollectionCreatedEvent extends DomainEvent<{ readonly title: string }> {}

export interface CollectionArticleAddedEvent
  extends DomainEvent<{ readonly articleId: ArticleId; readonly order: number }> {}

export interface CollectionArticleRemovedEvent
  extends DomainEvent<{ readonly articleId: ArticleId }> {}

export interface CollectionVisibilityChangedEvent
  extends DomainEvent<{ readonly isPublic: boolean }> {}

export interface CollectionRepository
  extends RepositoryPort<CollectionAggregate, CollectionId> {
  listByOwner(owner: Ownership): Promise<PaginatedResult<CollectionAggregate>>;
  listPublic(): Promise<PaginatedResult<CollectionAggregate>>;
}

export const COLLECTION_REPOSITORY = Symbol('COLLECTION_REPOSITORY');

export interface CreateCollectionCommand {
  readonly title: string;
  readonly description?: string;
  readonly isPublic: boolean;
  readonly ownerId: UUID;
  readonly teamId?: UUID;
}

export interface AddArticleToCollectionCommand {
  readonly collectionId: CollectionId;
  readonly articleId: ArticleId;
  readonly addedBy: UUID;
  readonly notes?: string;
}

export interface RemoveArticleFromCollectionCommand {
  readonly collectionId: CollectionId;
  readonly articleId: ArticleId;
  readonly removedBy: UUID;
}

export interface ChangeCollectionVisibilityCommand {
  readonly collectionId: CollectionId;
  readonly isPublic: boolean;
  readonly performedBy: UUID;
}

export type CollectionUseCase<TCommand, TResult> = UseCase<TCommand, TResult>;
