import { Injectable } from '@nestjs/common';
import { SharedKernelService, TaskQueueService, TaskType } from '@synop/shared-kernel';
import { CreateAiAnalysisTaskDto } from './dto/create-ai-analysis.dto';
import { CreateRenderTaskDto } from './dto/create-render-task.dto';

@Injectable()
export class GatewayService {
  constructor(
    private readonly sharedKernel: SharedKernelService,
    private readonly queue: TaskQueueService,
  ) {}

  async scheduleRenderTask(dto: CreateRenderTaskDto) {
    const payload = {
      slug: dto.slug,
      viewer: dto.viewer
        ? {
            id: dto.viewer.id ?? null,
            roles: dto.viewer.roles ?? [],
            attributes: dto.viewer.attributes ?? {},
          }
        : undefined,
    };

    const normalizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    const message = this.sharedKernel.buildTaskMessage({
      type: TaskType.RENDER_STATIC,
      payload: normalizedPayload,
      source: dto.source,
    });

    this.queue.publish(message);
    return message;
  }

  async scheduleAiAnalysis(dto: CreateAiAnalysisTaskDto) {
    const message = this.sharedKernel.buildTaskMessage({
      type: TaskType.ANALYZE_SOURCE,
      payload: dto,
      correlationId: dto.articleSlug,
      source: dto.sourceUrl,
    });

    this.queue.publish(message);
    return message;
  }
}
