import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskType, TaskMessage } from '@synop/shared-kernel';
import { WorkerIngestionService } from './worker-ingestion.service';

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

@Controller()
export class WorkerIngestionController {
  constructor(
    private readonly workerIngestionService: WorkerIngestionService,
  ) {}

  @Get('health')
  health() {
    return this.workerIngestionService.status();
  }

  @Get('recent')
  recent() {
    return this.workerIngestionService.recentIngestions();
  }

  @MessagePattern(TaskType.INGEST_WIKIPEDIA)
  handleIngestWikipedia(@Payload() task: TaskMessage<IngestionPayload>) {
    return this.workerIngestionService.ingestWikipedia(task);
  }

  @MessagePattern(TaskType.AI_DRAFT)
  handleAiDraft(@Payload() task: TaskMessage<AiDraftPayload>) {
    return this.workerIngestionService.aiDraft(task);
  }
}
