import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from '@synop/domains/bounded-contexts/knowledge/articles/domain/article.entity';
import { WorkerIngestionService } from './worker-ingestion.service';
import { WikipediaService } from './wikipedia.service';
import { LlmService } from './llm.service';
import { StorageService } from './storage.service';
import { DomainsService } from '@synop/domains';
import { ArticlesDomainService } from '@synop/domains/bounded-contexts/knowledge/articles/domain/articles.service';
import { TaskType } from '@synop/shared-kernel';
import { LocalGitRepositoryClient } from '@synop/shared-kernel';

describe('WorkerIngestionService', () => {
  let service: WorkerIngestionService;
  let wikipediaService: WikipediaService;
  let llmService: LlmService;
  let storageService: StorageService;
  let domainsService: DomainsService;
  let articlesDomainService: ArticlesDomainService;
  let gitRepositoryClient: LocalGitRepositoryClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerIngestionService,
        StorageService,
        ArticlesDomainService,
        { provide: WikipediaService, useValue: { getArticle: jest.fn() } },
        { provide: LlmService, useValue: { synthesize: jest.fn(), translate: jest.fn() } },
        { provide: LocalGitRepositoryClient, useValue: { commitArticle: jest.fn() } },
        { provide: DomainsService, useValue: { registerWorker: jest.fn() } },
        {
          provide: getRepositoryToken(Article),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({ ...dto, git_repo_name: dto.slug })),
            save: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<WorkerIngestionService>(WorkerIngestionService);
    wikipediaService = module.get<WikipediaService>(WikipediaService);
    llmService = module.get<LlmService>(LlmService);
    storageService = module.get<StorageService>(StorageService);
    domainsService = module.get<DomainsService>(DomainsService);
    articlesDomainService = module.get<ArticlesDomainService>(ArticlesDomainService);
    gitRepositoryClient = module.get<LocalGitRepositoryClient>(LocalGitRepositoryClient);
  });

  it('should process an ingestion task', async () => {
    const articleName = 'test-article';
    const languages = ['en', 'es'];
    const task = {
      id: 'test-task',
      type: TaskType.INGEST_WIKIPEDIA,
      payload: { articleName, languages },
    };

    (wikipediaService.getArticle as jest.Mock).mockImplementation((name, lang) =>
      Promise.resolve({ content: `content in ${lang}` }),
    );
    (llmService.synthesize as jest.Mock).mockResolvedValue('synthesized content');
    (llmService.translate as jest.Mock).mockImplementation((content, lang) =>
      Promise.resolve(`translated to ${lang}`),
    );

    let workerCallback;
    (domainsService.registerWorker as jest.Mock).mockImplementation((type, callback) => {
      workerCallback = callback;
    });

    service.onModuleInit();
    await workerCallback(task);

    expect(wikipediaService.getArticle).toHaveBeenCalledWith(articleName, 'en');
    expect(llmService.synthesize).toHaveBeenCalled();
    expect(llmService.translate).toHaveBeenCalled();
    expect(gitRepositoryClient.commitArticle).toHaveBeenCalled();
  });
});
