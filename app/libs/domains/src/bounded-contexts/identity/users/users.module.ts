import { Module } from '@nestjs/common';
import { UsersDomainService } from './domain/users.service';

@Module({
  providers: [UsersDomainService],
  exports: [UsersDomainService],
})
export class UsersDomainModule {}
