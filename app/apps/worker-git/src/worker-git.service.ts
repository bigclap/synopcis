import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  InMemoryGitRepositoryClient,
  TaskQueueService,
  TaskType,
} from '@synop/shared-kernel';
import { Subscription } from 'rxjs';

type MirrorPayload = {
  repository: string;
  author: string;
  message: string;
  files: Record<string, string>;
};

@Injectable()
export class WorkerGitService implements OnModuleInit, OnModuleDestroy {
  private subscription?: Subscription;
  private commitCount = 0;

  constructor(
    private readonly queue: TaskQueueService,
    private readonly git: InMemoryGitRepositoryClient,
  ) {}

  onModuleInit(): void {
    this.subscription = this.queue.consume<MirrorPayload>(
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
      { description: 'Git mirror processor' },
    );
  }

  onModuleDestroy(): void {
    this.subscription?.unsubscribe();
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
