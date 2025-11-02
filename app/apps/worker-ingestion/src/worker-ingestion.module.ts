import { Module } from '@nestjs/common';
import { ArticlesDomainModule } from '@synop/domains/bounded-contexts/knowledge/articles/articles.module';
import { WorkerIngestionController } from './worker-ingestion.controller';
import { WorkerIngestionService } from './worker-ingestion.service';
import { WikipediaService } from './wikipedia.service';
import { LlmService } from './llm.service';
import { StorageService } from './storage.service';

@Module({
  imports: [ArticlesDomainModule],
  controllers: [WorkerIngestionController],
  providers: [WorkerIngestionService, WikipediaService, LlmService, StorageService],
})
export class WorkerIngestionModule {}
