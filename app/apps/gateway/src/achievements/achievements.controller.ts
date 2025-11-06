import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AchievementDto } from './dto/achievement.dto';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiOkResponse({
    description: 'A list of achievements.',
    type: [AchievementDto],
  })
  getAchievements(): AchievementDto[] {
    return [
      {
        id: '1',
        name: 'First Steps',
        description: 'Create your first phenomenon.',
        icon: '🥇',
      },
      {
        id: '2',
        name: 'Collector',
        description: 'Create 10 phenomena.',
        icon: '📚',
      },
      {
        id: '3',
        name: 'Master Collector',
        description: 'Create 100 phenomena.',
        icon: '👑',
      },
    ];
  }
}
