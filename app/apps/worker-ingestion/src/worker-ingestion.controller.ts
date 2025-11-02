import { Controller, Get, Query } from '@nestjs/common';
import { WorkerIngestionService } from './worker-ingestion.service';

@Controller('worker-ingestion')
export class WorkerIngestionController {
  constructor(private readonly workerIngestionService: WorkerIngestionService) {}

  @Get('health')
  health() {
    return this.workerIngestionService.status();
  }

  @Get('recent')
  recent(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.workerIngestionService.recentIngestions(parsed ?? 5);
  }
}
