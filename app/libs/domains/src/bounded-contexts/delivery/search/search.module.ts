import { Module } from '@nestjs/common';
import { SearchDomainService } from './domain/search.service';

@Module({
  providers: [SearchDomainService],
  exports: [SearchDomainService],
})
export class SearchDomainModule {}
