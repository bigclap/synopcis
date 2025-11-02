import { Module } from '@nestjs/common';
import { DomainsModule } from '@synop/domains';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { PhenomenonController } from './phenomenon.controller';

@Module({
  imports: [DomainsModule],
  controllers: [GatewayController, PhenomenonController],
  providers: [GatewayService],
})
export class GatewayModule {}
