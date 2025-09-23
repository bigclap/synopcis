import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { FrontendController } from './frontend.controller';
import { FrontendService } from './frontend.service';

@Module({
  imports: [SharedKernelModule],
  controllers: [FrontendController],
  providers: [FrontendService],
})
export class FrontendModule {}
