import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ArticlesDomainService } from '@synop/domains';
import { PhenomenonStorageService } from '../../../libs/domains/src/phenomenon/phenomenon-storage.service';
import { LocalGitRepositoryClient } from '@synop/shared-kernel';

describe('StorageService', () => {
  let service: StorageService;
  let articlesDomainService: ArticlesDomainService;
  let gitRepositoryClient: LocalGitRepositoryClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ArticlesDomainService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: LocalGitRepositoryClient,
          useValue: {
            commitArticle: jest.fn(),
          },
        },
        {
          provide: PhenomenonStorageService,
          useValue: {
            updatePhenomenonBlocks: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    articlesDomainService = module.get<ArticlesDomainService>(ArticlesDomainService);
    gitRepositoryClient = module.get<LocalGitRepositoryClient>(LocalGitRepositoryClient);
  });

  it('should store an article', async () => {
    const articleName = 'test-article';
    const translatedArticles = [{ lang: 'en', content: 'test content' }];
    const article = { id: 1, git_repo_name: 'test-article' };
    (articlesDomainService.create as jest.Mock).mockResolvedValue(article);

    await service.storeArticle(articleName, translatedArticles);

    expect(articlesDomainService.create).toHaveBeenCalledWith({
      slug: articleName,
      title: articleName,
    });
    expect(gitRepositoryClient.commitArticle).toHaveBeenCalledWith({
      repository: article.git_repo_name,
      summary: `Initial import of article "${articleName}"`,
      sourceUrl: 'wikipedia',
      author: { name: 'Ingestion Worker' },
      blocks: [
        {
          lang: 'en',
          blockId: 1,
          label: 'content',
          content: 'test content',
        },
      ],
    });
  });
});
