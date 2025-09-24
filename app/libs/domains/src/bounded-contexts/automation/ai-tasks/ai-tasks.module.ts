import { Module } from '@nestjs/common';
import { AiTasksDomainService } from './domain/ai-tasks.service';

@Module({
  providers: [AiTasksDomainService],
  exports: [AiTasksDomainService],
})
export class AiTasksDomainModule {}
