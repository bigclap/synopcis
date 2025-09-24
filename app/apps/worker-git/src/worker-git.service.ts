import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DomainsService } from '@synop/domains';
import {
  GitCommitRecord,
  LocalGitRepositoryClient,
  TaskHandlerResult,
  TaskMessage,
  TaskType,
  UserAccount,
  UsersRepository,
  USERS_REPOSITORY,
} from '@synop/shared-kernel';

export interface UpdateFileRequest {
  readonly repository: string;
  readonly filePath: string;
  readonly content: string;
  readonly summary: string;
  readonly sourceUrl: string;
  readonly userId: string;
  readonly timestamp?: Date;
}

export type MirrorGitPayload = Omit<UpdateFileRequest, 'timestamp'> & {
  readonly timestamp?: string | Date;
};

@Injectable()
export class WorkerGitService implements OnModuleInit, OnModuleDestroy {
  private commitCount = 0;
  private unregister?: () => void;

  constructor(
    private readonly domains: DomainsService,
    private readonly git: LocalGitRepositoryClient,
    @Inject(USERS_REPOSITORY) private readonly users: UsersRepository,
  ) {}

  onModuleInit(): void {
    this.unregister = this.domains.registerWorker<MirrorGitPayload>(
      TaskType.MIRROR_GIT,
      async (task) => this.processTask(task),
      'Git repository updater',
    );
  }

  onModuleDestroy(): void {
    this.unregister?.();
  }

  async updateFile(request: UpdateFileRequest): Promise<GitCommitRecord> {
    const author = await this.loadAuthor(request.userId);

    const commit = await this.git.commit({
      repository: request.repository,
      summary: request.summary,
      sourceUrl: request.sourceUrl,
      author: {
        name: author.displayName,
        email: author.email ?? undefined,
      },
      changes: {
        [request.filePath]: request.content,
      },
      timestamp: request.timestamp,
    });

    this.commitCount += 1;
    return commit;
  }

  status() {
    return {
      status: 'ready',
      commits: this.commitCount,
    };
  }

  history(repository: string, limit = 5): Promise<GitCommitRecord[]> {
    return this.git.history(repository, limit);
  }

  private async processTask(
    task: TaskMessage<MirrorGitPayload>,
  ): Promise<TaskHandlerResult> {
    const commit = await this.updateFile({
      repository: task.payload.repository,
      filePath: task.payload.filePath,
      content: task.payload.content,
      summary: task.payload.summary,
      sourceUrl: task.payload.sourceUrl,
      userId: task.payload.userId,
      timestamp: task.payload.timestamp
        ? new Date(task.payload.timestamp)
        : undefined,
    });

    return {
      taskId: task.id,
      type: task.type,
      status: 'completed',
      detail: `committed ${commit.hash} to ${commit.repository}`,
    };
  }

  private async loadAuthor(userId: string): Promise<UserAccount> {
    const author = await this.users.findById(userId);
    if (!author) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    return author;
  }
}
