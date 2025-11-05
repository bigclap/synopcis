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
import {
  GitCommitDto,
  GitInitDto,
  GitReadFileDto,
  TaskMessage,
  TaskType,
} from '@synop/shared-kernel';
import { UpdateFileDto } from './dto/update-file.dto';
import { WorkerGitService } from './worker-git.service';

@Controller('worker-git')
export class WorkerGitController {
  constructor(
    private readonly workerGitService: WorkerGitService,
    private readonly gitRepositoryClient: LocalGitRepositoryClient,
  ) {}

  @MessagePattern(TaskType.GIT_INIT)
  async initRepository(message: TaskMessage<GitInitDto>) {
    const { repository } = message.payload;
    return this.gitRepositoryClient.initializeRepository(repository);
  }

  @MessagePattern(TaskType.GIT_COMMIT)
  async commit(message: TaskMessage<GitCommitDto>) {
    return this.gitRepositoryClient.commit(message.payload);
  }

  @MessagePattern(TaskType.GIT_READ_FILE)
  async readFile(message: TaskMessage<GitReadFileDto>) {
    const { repository, filePath } = message.payload;
    return this.gitRepositoryClient.readFile(repository, filePath);
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
