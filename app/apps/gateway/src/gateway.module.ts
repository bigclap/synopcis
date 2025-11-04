import { Module } from '@nestjs/common';
import { DomainsModule } from '@synop/domains';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { PhenomenonController } from './phenomenon.controller';
import { PhenomenonService } from './phenomenon.service';
import { SharedKernelModule } from '@synop/shared-kernel';

@Module({
  imports: [DomainsModule, SharedKernelModule],
  controllers: [GatewayController, PhenomenonController],
  providers: [GatewayService],
})
export class GatewayModule {}
