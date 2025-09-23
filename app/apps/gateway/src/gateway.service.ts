import { Injectable } from '@nestjs/common';
import { DomainsService } from '@synop/domains';
import { CreateAiAnalysisTaskDto } from './dto/create-ai-analysis.dto';
import { CreateRenderTaskDto } from './dto/create-render-task.dto';
import { TaskType } from '@synop/shared-kernel';

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
}
