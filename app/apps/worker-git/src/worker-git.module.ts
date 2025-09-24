import { Module } from '@nestjs/common';
import { PgUsersRepository, USERS_REPOSITORY } from '@synop/shared-kernel';
import { WorkerGitController } from './worker-git.controller';
import { WorkerGitService } from './worker-git.service';

@Module({
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
