import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DomainsService } from '@synop/domains';
import {
  InMemoryGitRepositoryClient,
  TaskType,
} from '@synop/shared-kernel';

type MirrorPayload = {
  repository: string;
  author: string;
  message: string;
  files: Record<string, string>;
};

@Injectable()
export class WorkerGitService implements OnModuleInit, OnModuleDestroy {
  private unregister?: () => void;
  private commitCount = 0;

  constructor(
    private readonly domains: DomainsService,
    private readonly git: InMemoryGitRepositoryClient,
  ) {}

  onModuleInit(): void {
    this.unregister = this.domains.registerWorker<MirrorPayload>(
      TaskType.MIRROR_GIT,
      async (task) => {
        const commit = await this.git.commit({
          author: task.payload.author,
          message: `[${task.payload.repository}] ${task.payload.message}`,
          changes: task.payload.files,
        });

        this.commitCount += 1;

        return {
          taskId: task.id,
          type: task.type,
          status: 'completed',
          detail: `mirrored commit ${commit.hash}`,
        };
      },
      'Git mirror processor',
    );
  }

  onModuleDestroy(): void {
    this.unregister?.();
  }

  status() {
    return {
      status: 'ready',
      commits: this.commitCount,
    };
  }

  history(limit = 5) {
    return this.git.history(limit);
  }
}
