import { Inject, Injectable } from '@nestjs/common';
import {
  ARTICLE_REPOSITORY,
  ArticleAggregate,
  ArticleRepository,
  ChangeArticleStatusCommand,
  CreateArticleCommand,
  FreezeArticleCommand,
  LinkArticleConceptCommand,
  UpdateArticleMetadataCommand,
} from './articles.domain.entity';

@Injectable()
export class ArticlesDomainService {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly repository: ArticleRepository,
  ) {}

  async create(command: CreateArticleCommand): Promise<ArticleAggregate> {
    // TODO: implement article creation
    throw new Error('ArticlesDomainService.create not implemented');
  }

  async updateMetadata(
    command: UpdateArticleMetadataCommand,
  ): Promise<ArticleAggregate> {
    // TODO: implement metadata update
    throw new Error('ArticlesDomainService.updateMetadata not implemented');
  }

  async changeStatus(
    command: ChangeArticleStatusCommand,
  ): Promise<ArticleAggregate> {
    // TODO: implement status change
    throw new Error('ArticlesDomainService.changeStatus not implemented');
  }

  async freeze(command: FreezeArticleCommand): Promise<ArticleAggregate> {
    // TODO: implement freeze logic
    throw new Error('ArticlesDomainService.freeze not implemented');
  }

  async linkConcept(
    command: LinkArticleConceptCommand,
  ): Promise<ArticleAggregate> {
    // TODO: implement concept linking
    throw new Error('ArticlesDomainService.linkConcept not implemented');
  }
}
