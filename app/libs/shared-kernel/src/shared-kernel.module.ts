import { Module } from '@nestjs/common';
import { TaskQueueService } from './queue/task-queue.service';

@Module({
  providers: [TaskQueueService],
  exports: [TaskQueueService],
})
export class SharedKernelModule {}
