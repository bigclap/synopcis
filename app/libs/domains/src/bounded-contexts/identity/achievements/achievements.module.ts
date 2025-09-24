import { Module } from '@nestjs/common';
import { AchievementsDomainService } from './domain/achievements.service';

@Module({
  providers: [AchievementsDomainService],
  exports: [AchievementsDomainService],
})
export class AchievementsDomainModule {}
