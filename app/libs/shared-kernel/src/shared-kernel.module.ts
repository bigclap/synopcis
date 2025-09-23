import { Global, Module } from '@nestjs/common';
import { DatabaseConfigService } from './integrations/database/database-config';
import { InMemoryGitRepositoryClient } from './integrations/git/git-repository.client';
import { InMemoryObjectStorageClient } from './integrations/storage/object-storage.client';
import { MarkdownRenderer } from './rendering/markdown.renderer';
import { SharedKernelService } from './shared-kernel.service';
import { TaskQueueService } from './queue/task-queue.service';

@Global()
@Module({
  providers: [
    SharedKernelService,
    TaskQueueService,
    MarkdownRenderer,
    InMemoryGitRepositoryClient,
    InMemoryObjectStorageClient,
    DatabaseConfigService,
  ],
  exports: [
    SharedKernelService,
    TaskQueueService,
    MarkdownRenderer,
    InMemoryGitRepositoryClient,
    InMemoryObjectStorageClient,
    DatabaseConfigService,
  ],
})
export class SharedKernelModule {}
