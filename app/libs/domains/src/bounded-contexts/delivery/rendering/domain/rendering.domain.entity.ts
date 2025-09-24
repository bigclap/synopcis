import {
  AggregateRoot,
  DomainEvent,
  Identifier,
  RepositoryPort,
  UUID,
  UseCase,
  ValueObject,
} from '../../../../core';
import { ArticleId } from '../../knowledge/articles/domain/articles.domain.entity';

export type RenderJobId = Identifier;

export type RenderJobStatus = 'queued' | 'rendering' | 'completed' | 'failed';

export interface RenderManifest extends ValueObject<Record<string, unknown>> {
  readonly checksum: string;
}

export interface RenderJobProps {
  readonly articleId: ArticleId;
  readonly status: RenderJobStatus;
  readonly requestedBy: UUID;
  readonly manifest?: RenderManifest;
  readonly error?: string;
  readonly queuedAt: Date;
  readonly renderedAt?: Date;
}

export interface RenderJobAggregate
  extends AggregateRoot<RenderJobId, RenderJobProps, RenderJobEvent> {}

export interface RenderJobRepository
  extends RepositoryPort<RenderJobAggregate, RenderJobId> {
  findLatestByArticle(articleId: ArticleId): Promise<RenderJobAggregate | null>;
}

export const RENDER_JOB_REPOSITORY = Symbol('RENDER_JOB_REPOSITORY');

export interface RenderJobEvent
  extends DomainEvent<{ readonly articleId: ArticleId; readonly status: RenderJobStatus }> {}

export interface ScheduleRenderCommand {
  readonly articleId: ArticleId;
  readonly requestedBy: UUID;
}

export interface CompleteRenderCommand {
  readonly jobId: RenderJobId;
  readonly manifest: RenderManifest;
}

export interface FailRenderCommand {
  readonly jobId: RenderJobId;
  readonly error: string;
}

export interface RenderingUseCases {
  readonly scheduleRender: UseCase<ScheduleRenderCommand, RenderJobEvent>;
  readonly completeRender: UseCase<CompleteRenderCommand, RenderJobEvent>;
  readonly failRender: UseCase<FailRenderCommand, RenderJobEvent>;
}

//TODO Implement render aggregate and integrate with markdown renderer adapter.
