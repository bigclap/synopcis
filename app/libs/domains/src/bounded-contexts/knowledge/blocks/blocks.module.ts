import { Module } from '@nestjs/common';
import { BlocksDomainService } from './domain/blocks.service';

@Module({
  providers: [BlocksDomainService],
  exports: [BlocksDomainService],
})
export class BlocksDomainModule {}
