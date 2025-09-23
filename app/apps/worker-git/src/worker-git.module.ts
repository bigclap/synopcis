import { Module } from '@nestjs/common';
import { DomainsModule } from '@synop/domains';
import { WorkerGitController } from './worker-git.controller';
import { WorkerGitService } from './worker-git.service';

@Module({
  imports: [DomainsModule],
  controllers: [WorkerGitController],
  providers: [WorkerGitService],
})
export class WorkerGitModule {}
