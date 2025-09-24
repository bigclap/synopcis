import { Module } from '@nestjs/common';
import { AnalyticsDomainService } from './domain/analytics.service';

@Module({
  providers: [AnalyticsDomainService],
  exports: [AnalyticsDomainService],
})
export class AnalyticsDomainModule {}
