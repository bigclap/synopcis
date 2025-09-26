import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { RenderModule } from '@synop/rendering';
import { WorkerFrontendController } from './worker-frontend.controller';
import { WorkerFrontendService } from './worker-frontend.service';

@Module({
  imports: [SharedKernelModule, RenderModule],
  controllers: [WorkerFrontendController],
  providers: [WorkerFrontendService],
})
export class WorkerFrontendModule {}
