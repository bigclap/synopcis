import { Controller, Get, Query } from '@nestjs/common';
import { WorkerGitService } from './worker-git.service';

@Controller('worker-git')
export class WorkerGitController {
  constructor(private readonly workerGitService: WorkerGitService) {}

  @Get('health')
  health() {
    return this.workerGitService.status();
  }

  @Get('history')
  async history(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.workerGitService.history(parsed ?? 5);
  }
}
