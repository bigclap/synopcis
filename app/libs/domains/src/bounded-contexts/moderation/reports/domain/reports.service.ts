import { Inject, Injectable } from '@nestjs/common';
import {
  REPORT_REPOSITORY,
  AssignReportCommand,
  FileReportCommand,
  RejectReportCommand,
  ReportAggregate,
  ReportRepository,
  ResolveReportCommand,
} from './reports.domain.entity';

@Injectable()
export class ModerationReportsDomainService {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly repository: ReportRepository,
  ) {}

  async file(command: FileReportCommand): Promise<ReportAggregate> {
    // TODO: implement report filing logic
    throw new Error('ModerationReportsDomainService.file not implemented');
  }

  async assign(command: AssignReportCommand): Promise<ReportAggregate> {
    // TODO: implement report assignment logic
    throw new Error('ModerationReportsDomainService.assign not implemented');
  }

  async resolve(command: ResolveReportCommand): Promise<ReportAggregate> {
    // TODO: implement report resolution logic
    throw new Error('ModerationReportsDomainService.resolve not implemented');
  }

  async reject(command: RejectReportCommand): Promise<ReportAggregate> {
    // TODO: implement report rejection logic
    throw new Error('ModerationReportsDomainService.reject not implemented');
  }
}
