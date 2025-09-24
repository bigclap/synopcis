import { DomainPolicy, Ownership, UUID } from '../../../../core';
import { ArticleAggregate } from '../../knowledge/articles/domain/articles.domain.entity';
import { BlockAggregate } from '../../knowledge/blocks/domain/blocks.domain.entity';

export interface ModerationPolicyRegistry {
  readonly articleFreezePolicy: DomainPolicy<ArticleFreezeContext>;
  readonly blockSourcePolicy: DomainPolicy<BlockSourceContext>;
  readonly userRestrictionPolicy: DomainPolicy<UserRestrictionContext>;
}

export const MODERATION_POLICY_REGISTRY = Symbol('MODERATION_POLICY_REGISTRY');

export interface ArticleFreezeContext {
  readonly article: ArticleAggregate;
  readonly actorId: UUID;
  readonly reason: string;
}

export interface BlockSourceContext {
  readonly block: BlockAggregate;
  readonly sourceUrl: string;
  readonly actorId: UUID;
}

export interface UserRestrictionContext {
  readonly userId: UUID;
  readonly ownership: Ownership;
  readonly restrictionReason: string;
  readonly durationHours: number;
}

//TODO Provide concrete implementations once infrastructure adapters are available.
