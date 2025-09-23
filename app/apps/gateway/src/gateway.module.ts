import { Module } from '@nestjs/common';
import { DomainsModule } from '@synop/domains';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

@Module({
  imports: [DomainsModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
