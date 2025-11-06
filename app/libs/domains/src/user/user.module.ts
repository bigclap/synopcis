import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserDomainService } from './user.domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserDomainService],
  exports: [UserDomainService],
})
export class UserModule {}
