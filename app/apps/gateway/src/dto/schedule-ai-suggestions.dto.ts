import { IsString } from 'class-validator';

export class ScheduleAiSuggestionsDto {
  @IsString()
  readonly phenomenonSlug: string;

  @IsString()
  readonly text: string;

  @IsString()
  readonly userId: string;
}
