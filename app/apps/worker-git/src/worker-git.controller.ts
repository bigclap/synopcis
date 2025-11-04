import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  PhenomenonDomainService,
  PhenomenonStorageService,
} from '@synop/domains';
import { TaskMessage, TaskType } from '@synop/shared-kernel';
import { UpdateFileDto } from './dto/update-file.dto';
import { WorkerGitService } from './worker-git.service';

@Controller('worker-git')
export class WorkerGitController {
  constructor(
    private readonly workerGitService: WorkerGitService,
    private readonly phenomenonStorageService: PhenomenonStorageService,
    private readonly phenomenonDomainService: PhenomenonDomainService,
  ) {}

  @MessagePattern(TaskType.CREATE_PHENOMENON)
  async createPhenomenon(message: TaskMessage<{ phenomenonId: string }>) {
    const { phenomenonId } = message.payload;
    const phenomenon = await this.phenomenonDomainService.findPhenomenonById(
      phenomenonId,
    );
    if (!phenomenon) {
      throw new BadRequestException(
        `Phenomenon with id ${phenomenonId} was not found`,
      );
    }
    await this.phenomenonStorageService.createPhenomenon(phenomenon.slug);
  }

  @Get('health')
  health() {
    return this.workerGitService.status();
  }

  @Get('history')
  async history(
    @Query('repository') repository?: string,
    @Query('limit') limit?: string,
  ) {
    if (!repository) {
      throw new BadRequestException('repository query parameter is required');
    }

    const parsed = limit ? Number(limit) : undefined;
    return this.workerGitService.history(repository, parsed ?? 5);
  }

  @Post('update-file')
  async updateFile(@Body() body: UpdateFileDto) {
    const commit = await this.workerGitService.updateFile({
      repository: body.repository,
      filePath: body.filePath,
      content: body.content,
      summary: body.summary,
      sourceUrl: body.sourceUrl,
      userId: body.userId,
      timestamp: body.timestamp ? new Date(body.timestamp) : undefined,
    });

    return {
      status: 'committed',
      commit,
    };
  }
}
