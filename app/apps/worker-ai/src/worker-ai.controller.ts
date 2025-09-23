import { Controller, Get, Query } from '@nestjs/common';
import { WorkerAiService } from './worker-ai.service';

@Controller('worker-ai')
export class WorkerAiController {
  constructor(private readonly workerAiService: WorkerAiService) {}

  @Get('health')
  health() {
    return this.workerAiService.status();
  }

  @Get('recent')
  recent(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.workerAiService.recentAnalyses(parsed ?? 5);
  }
}
