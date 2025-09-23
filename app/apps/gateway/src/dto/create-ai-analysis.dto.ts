import { IsString, IsUrl } from 'class-validator';

export class CreateAiAnalysisTaskDto {
  @IsUrl({ protocols: ['http', 'https'] })
  sourceUrl!: string;

  @IsString()
  articleSlug!: string;
}
