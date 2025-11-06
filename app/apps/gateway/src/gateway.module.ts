import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { PhenomenonController } from './phenomenon.controller';
import { PhenomenonService } from './phenomenon.service';
import { AchievementsController } from './achievements.controller';
import { SharedKernelModule } from '@synop/shared-kernel';
import { AchievementsModule } from '@synop/domains';

@Module({
  imports: [
    SharedKernelModule,
    AchievementsModule,
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [GatewayController, PhenomenonController, AchievementsController],
  providers: [GatewayService, PhenomenonService],
})
export class GatewayModule {}
