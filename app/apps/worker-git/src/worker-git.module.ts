import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { WorkerGitController } from './worker-git.controller';
import { WorkerGitService } from './worker-git.service';

@Module({
  imports: [SharedKernelModule],
  controllers: [WorkerGitController],
  providers: [WorkerGitService],
})
export class WorkerGitModule {}
