import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

@Module({
  imports: [SharedKernelModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
