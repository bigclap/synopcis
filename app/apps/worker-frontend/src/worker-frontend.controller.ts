import { Controller, Get, Query } from '@nestjs/common';
import { WorkerFrontendService } from './worker-frontend.service';

@Controller('worker-frontend')
export class WorkerFrontendController {
  constructor(private readonly workerFrontendService: WorkerFrontendService) {}

  @Get('health')
  health() {
    return this.workerFrontendService.status();
  }

  @Get('renders')
  renders(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.workerFrontendService.recentRenders(
      parsed && Number.isFinite(parsed) && parsed > 0 ? parsed : 5,
    );
  }
}
