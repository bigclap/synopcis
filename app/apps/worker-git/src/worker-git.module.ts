import { Module } from '@nestjs/common';
import { DomainsModule } from '@synop/domains';
import { PgUsersRepository, USERS_REPOSITORY } from '@synop/shared-kernel';
import { WorkerGitController } from './worker-git.controller';
import { WorkerGitService } from './worker-git.service';

@Module({
  imports: [DomainsModule],
  controllers: [WorkerGitController],
  providers: [
    WorkerGitService,
    {
      provide: USERS_REPOSITORY,
      useClass: PgUsersRepository,
    },
  ],
})
export class WorkerGitModule {}
