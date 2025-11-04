import { Injectable } from '@nestjs/common';
import { DomainsService } from '@synop/domains';
import { CreateAiAnalysisTaskDto } from './dto/create-ai-analysis.dto';
import { CreateRenderTaskDto } from './dto/create-render-task.dto';
import { CreateIngestionTaskDto } from './dto/create-ingestion-task.dto';
import { CreateAiDraftTaskDto } from './dto/create-ai-draft-task.dto';
import { TaskType } from '@synop/shared-kernel';
import { ScheduleAiSuggestionsDto } from './dto/schedule-ai-suggestions.dto';

@Injectable()
export class GatewayService {
  constructor(private readonly domains: DomainsService) {}

  async scheduleRenderTask(dto: CreateRenderTaskDto) {
    return this.domains.publishTask({
      type: TaskType.RENDER_STATIC,
      payload: dto,
      source: dto.source,
    });
  }

  async scheduleAiAnalysis(dto: CreateAiAnalysisTaskDto) {
    return this.domains.publishTask({
      type: TaskType.ANALYZE_SOURCE,
      payload: dto,
      correlationId: dto.articleSlug,
      source: dto.sourceUrl,
    });
  }

  async scheduleIngestion(dto: CreateIngestionTaskDto) {
    return this.domains.publishTask({
      type: TaskType.INGEST_WIKIPEDIA,
      payload: dto,
      correlationId: dto.articleName,
      source: 'wikipedia',
    });
  }

  async scheduleAiDraft(dto: CreateAiDraftTaskDto) {
    return this.domains.publishTask({
      type: TaskType.AI_DRAFT,
      payload: dto,
      correlationId: dto.phenomenonSlug,
      source: 'wikipedia',
    });
  }

  async scheduleAiSuggestions(dto: ScheduleAiSuggestionsDto) {
    return this.domains.publishTask({
      type: TaskType.GET_AI_SUGGESTIONS,
      payload: dto,
      correlationId: dto.phenomenonSlug,
      source: 'user-input',
    });
  }
}
