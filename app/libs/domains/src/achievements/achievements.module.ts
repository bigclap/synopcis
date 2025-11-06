import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementEntity } from './achievement.entity';
import { AchievementsDomainService } from './achievements.domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementEntity])],
  providers: [AchievementsDomainService],
  exports: [AchievementsDomainService],
})
export class AchievementsModule {}
