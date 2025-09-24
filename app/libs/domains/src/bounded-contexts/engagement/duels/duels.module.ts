import { Module } from '@nestjs/common';
import { DuelsDomainService } from './domain/duels.service';

@Module({
  providers: [DuelsDomainService],
  exports: [DuelsDomainService],
})
export class DuelsDomainModule {}
