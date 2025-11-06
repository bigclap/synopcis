import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementEntity } from './achievement.entity';

@Injectable()
export class AchievementsDomainService {
  constructor(
    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,
  ) {}

  findAll(): Promise<AchievementEntity[]> {
    return this.achievementRepository.find();
  }
}
