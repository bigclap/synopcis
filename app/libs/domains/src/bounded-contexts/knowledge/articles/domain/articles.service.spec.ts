import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { ArticlesDomainService } from './articles.service';
import { CreateArticleCommand } from './articles.domain.entity';

describe('ArticlesDomainService', () => {
  let service: ArticlesDomainService;
  let repository: Repository<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesDomainService,
        {
          provide: getRepositoryToken(Article),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ArticlesDomainService>(ArticlesDomainService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an article', async () => {
    const article = new Article();
    article.id = 1;
    article.slug = 'test';
    article.git_repo_name = 'test';
    jest.spyOn(repository, 'create').mockReturnValue(article);
    jest.spyOn(repository, 'save').mockResolvedValue(article);

    const command: CreateArticleCommand = {
      slug: 'test',
      title: 'Test',
      summary: 'Test',
      language: 'en',
      ownerId: 'test-uuid',
    };
    const createdArticle = await service.create(command);
    expect(repository.create).toHaveBeenCalledWith({
      slug: 'test',
      git_repo_name: 'test',
    });
    expect(createdArticle).toEqual(article);
  });
});
