import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AchievementDto } from './dto/achievement.dto';
import { AchievementsDomainService, AchievementEntity } from '@synop/domains';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsDomainService: AchievementsDomainService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiOkResponse({
    description: 'A list of achievements.',
    type: [AchievementDto],
  })
  getAchievements(): Promise<AchievementEntity[]> {
    return this.achievementsDomainService.findAll();
  }
}
