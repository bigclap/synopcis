import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementEntity } from './achievement.entity';
import { AchievementsDomainService } from './achievements.domain.service';

describe('AchievementsDomainService', () => {
  let service: AchievementsDomainService;
  let repository: Repository<AchievementEntity>;

  const mockAchievementEntity: AchievementEntity = {
    id: '1',
    name: 'Test Achievement',
    description: 'Test Description',
    icon: '🏆',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsDomainService,
        {
          provide: getRepositoryToken(AchievementEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AchievementsDomainService>(AchievementsDomainService);
    repository = module.get<Repository<AchievementEntity>>(
      getRepositoryToken(AchievementEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of achievements', async () => {
      const result: AchievementEntity[] = [mockAchievementEntity];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });
});
