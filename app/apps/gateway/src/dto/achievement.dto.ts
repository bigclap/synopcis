import { ApiProperty } from '@nestjs/swagger';

export class AchievementDto {
  @ApiProperty({
    example: '1',
    description: 'The unique identifier of the achievement.',
  })
  id: string;

  @ApiProperty({
    example: 'First Steps',
    description: 'The name of the achievement.',
  })
  name: string;

  @ApiProperty({
    example: 'Create your first phenomenon.',
    description: 'A short description of the achievement.',
  })
  description: string;

  @ApiProperty({
    example: '🥇',
    description: 'The icon representing the achievement.',
  })
  icon: string;
}
