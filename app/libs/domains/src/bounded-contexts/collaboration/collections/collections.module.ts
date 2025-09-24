import { Module } from '@nestjs/common';
import { CollectionsDomainService } from './domain/collections.service';

@Module({
  providers: [CollectionsDomainService],
  exports: [CollectionsDomainService],
})
export class CollectionsDomainModule {}
