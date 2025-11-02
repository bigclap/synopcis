import { Test, TestingModule } from '@nestjs/testing';
import { WikipediaService } from './wikipedia.service';
import wiki from 'wikipedia-js';

jest.mock('wikipedia-js', () => ({
  page: jest.fn(),
}));

describe('WikipediaService', () => {
  let service: WikipediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WikipediaService],
    }).compile();

    service = module.get<WikipediaService>(WikipediaService);
  });

  it('should get an article', async () => {
    const articleName = 'test-article';
    const lang = 'en';
    const content = 'test content';
    const page = {
      content: jest.fn().mockResolvedValue(content),
      summary: jest.fn(),
    };
    (wiki.page as jest.Mock).mockResolvedValue(page);

    const result = await service.getArticle(articleName, lang);

    expect(wiki.page).toHaveBeenCalledWith(articleName, {
      apiUrl: `http://${lang}.wikipedia.org/w/api.php`,
      origin: '*',
    });
    expect(page.content).toHaveBeenCalled();
    expect(result).toEqual({ content });
  });
});
