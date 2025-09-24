import { Module } from '@nestjs/common';
import { ModerationReportsDomainService } from './domain/reports.service';

@Module({
  providers: [ModerationReportsDomainService],
  exports: [ModerationReportsDomainService],
})
export class ModerationReportsDomainModule {}
