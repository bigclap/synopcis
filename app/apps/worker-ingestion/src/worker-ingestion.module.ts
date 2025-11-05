import { Module } from '@nestjs/common';
import {
  ArticlesDomainModule,
  PhenomenonModule,
} from '@synop/domains';
import { WorkerIngestionController } from './worker-ingestion.controller';
import { WorkerIngestionService } from './worker-ingestion.service';
import { WikipediaService } from './wikipedia.service';
import { LlmService } from './llm.service';
import { StorageService } from './storage.service';

@Module({
  imports: [ArticlesDomainModule, PhenomenonModule],
  controllers: [WorkerIngestionController],
  providers: [
    WorkerIngestionService,
    WikipediaService,
    LlmService,
    StorageService,
  ],
})
export class WorkerIngestionModule {}
