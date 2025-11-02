import { Injectable, Logger } from '@nestjs/common';
import { ArticlesDomainService } from '@synop/domains/bounded-contexts/knowledge/articles/domain/articles.service';
import { LocalGitRepositoryClient } from '@synop/shared-kernel';
import { CreateArticleCommand } from '@synop/domains/bounded-contexts/knowledge/articles/domain/articles.domain.entity';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    private readonly articlesDomainService: ArticlesDomainService,
    private readonly gitRepositoryClient: LocalGitRepositoryClient,
  ) {}

  async storeArticle(
    articleName: string,
    translatedArticles: { lang: string; content: string }[],
  ): Promise<void> {
    this.logger.log(`Storing article "${articleName}"`);
    const createArticleCommand: CreateArticleCommand = {
      slug: articleName,
      title: articleName,
    };
    const article = await this.articlesDomainService.create(createArticleCommand);

    const blocks = translatedArticles.map(({ lang, content }, index) => ({
      lang,
      blockId: index + 1,
      label: 'content',
      content,
    }));

    await this.gitRepositoryClient.commitArticle({
      repository: article.git_repo_name,
      summary: `Initial import of article "${articleName}"`,
      sourceUrl: 'wikipedia',
      author: { name: 'Ingestion Worker' },
      blocks,
    });
  }
}
