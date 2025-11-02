import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { DomainsService } from '@synop/domains';
import { TaskType } from '@synop/shared-kernel';
import { WikipediaService } from './wikipedia.service';
import { LlmService } from './llm.service';
import { StorageService } from './storage.service';

type IngestionPayload = {
  articleName: string;
  languages: string[];
};

type AiDraftPayload = {
  phenomenonSlug: string;
  wikipediaArticle: string;
  lang: string;
  userId: string;
};

type IngestionRecord = {
  id: string;
  articleName: string;
  languages: string[];
  completedAt: Date;
};

@Injectable()
export class WorkerIngestionService implements OnModuleInit, OnModuleDestroy {
  private unregisterIngestion?: () => void;
  private unregisterAiDraft?: () => void;
  private readonly processed: IngestionRecord[] = [];
  private readonly logger = new Logger(WorkerIngestionService.name);

  constructor(
    private readonly domains: DomainsService,
    private readonly wikipediaService: WikipediaService,
    private readonly llmService: LlmService,
    private readonly storageService: StorageService,
  ) {}

  onModuleInit(): void {
    this.unregisterIngestion = this.domains.registerWorker<IngestionPayload>(
      TaskType.INGEST_WIKIPEDIA,
      this.handleIngestionTask.bind(this),
      'Wikipedia Ingestion Worker',
    );

    this.unregisterAiDraft = this.domains.registerWorker<AiDraftPayload>(
      TaskType.AI_DRAFT,
      this.handleAiDraftTask.bind(this),
      'AI Draft Worker',
    );
  }

  private async handleAiDraftTask(task) {
    const { phenomenonSlug, wikipediaArticle, lang, userId } = task.payload;
    this.logger.log(`Generating AI draft for "${phenomenonSlug}" from "${wikipediaArticle}" in ${lang}`);
    const { content } = await this.wikipediaService.getArticle(wikipediaArticle, lang);
    const blocks = await this.llmService.generateBlocks(content);
    // TODO: get author from user session
    const author = { name: userId, email: `${userId}@synop.one` };
    await this.storageService.storePhenomenonBlocks(phenomenonSlug, blocks, author);
    this.processed.push({
      id: task.id,
      articleName: wikipediaArticle,
      languages: [lang],
      completedAt: new Date(),
    });
    return {
      taskId: task.id,
      type: task.type,
      status: 'completed',
      detail: `Generated AI draft for "${phenomenonSlug}"`,
      payload: { blocks },
    };
  }

  private async handleIngestionTask(task) {
    const { articleName, languages } = task.payload;
    this.logger.log(`Processing article "${articleName}" in languages: ${languages.join(', ')}`);

    const articles = await Promise.all(
      languages.map(async (lang) => {
        try {
          const article = await this.wikipediaService.getArticle(articleName, lang);
          return { lang, content: article.content };
        } catch (error) {
          this.logger.error(`Failed to fetch article "${articleName}" in ${lang}`, error);
          return { lang, content: '', error };
        }
      }),
    );

    const successfulArticles = articles.filter((a) => !a.error);
    const commonEdition = await this.llmService.synthesize(successfulArticles);

    const translatedArticles = await Promise.all(
      languages.map(async (lang) => {
        try {
          const translated = await this.llmService.translate(commonEdition, lang);
          return { lang, content: translated };
        } catch (error) {
          this.logger.error(`Failed to translate article "${articleName}" to ${lang}`, error);
          return { lang, content: '', error };
        }
      }),
    );

    await this.storageService.storeArticle(articleName, translatedArticles.filter((a) => !a.error));

    this.processed.push({
      id: task.id,
      articleName,
      languages,
      completedAt: new Date(),
    });

    return {
      taskId: task.id,
      type: task.type,
      status: 'completed',
      detail: `Stored article "${articleName}" in ${languages.length} languages.`,
      payload: translatedArticles,
    };
  }

  onModuleDestroy(): void {
    this.unregisterIngestion?.();
    this.unregisterAiDraft?.();
  }

  status() {
    return {
      status: 'ready',
      processed: this.processed.length,
    };
  }

  recentIngestions(limit = 5): IngestionRecord[] {
    return this.processed.slice(-limit).reverse();
  }
}
