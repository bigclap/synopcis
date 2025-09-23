import { Module } from '@nestjs/common';
import { DomainsModule } from '@synop/domains';
import { WorkerAiController } from './worker-ai.controller';
import { WorkerAiService } from './worker-ai.service';

@Module({
  imports: [DomainsModule],
  controllers: [WorkerAiController],
  providers: [WorkerAiService],
})
export class WorkerAiModule {}
