import { IsString } from 'class-validator';

export class CreateAiDraftTaskDto {
  @IsString()
  phenomenonSlug: string;

  @IsString()
  wikipediaArticle: string;

  @IsString()
  lang: string;

  @IsString()
  userId: string;
}
