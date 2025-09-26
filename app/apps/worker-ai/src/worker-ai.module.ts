import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { WorkerAiController } from './worker-ai.controller';
import { WorkerAiService } from './worker-ai.service';

@Module({
  imports: [SharedKernelModule],
  controllers: [WorkerAiController],
  providers: [WorkerAiService],
})
export class WorkerAiModule {}
