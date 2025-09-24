import { Inject, Injectable } from '@nestjs/common';
import {
  KNOWLEDGE_SEARCH_PORT,
  KnowledgeSearchPort,
  SearchArticlesQuery,
  SearchConceptsQuery,
  SearchResult,
} from './search.domain.entity';
import { ArticleAggregate } from '../../knowledge/articles/domain/articles.domain.entity';
import { ConceptAggregate } from '../../knowledge/concepts/domain/concepts.domain.entity';

@Injectable()
export class SearchDomainService {
  constructor(
    @Inject(KNOWLEDGE_SEARCH_PORT)
    private readonly searchPort: KnowledgeSearchPort,
  ) {}

  async searchArticles(
    query: SearchArticlesQuery,
  ): Promise<readonly SearchResult<ArticleAggregate>[]> {
    // TODO: implement article search orchestration
    throw new Error('SearchDomainService.searchArticles not implemented');
  }

  async searchConcepts(
    query: SearchConceptsQuery,
  ): Promise<readonly SearchResult<ConceptAggregate>[]> {
    // TODO: implement concept search orchestration
    throw new Error('SearchDomainService.searchConcepts not implemented');
  }
}
