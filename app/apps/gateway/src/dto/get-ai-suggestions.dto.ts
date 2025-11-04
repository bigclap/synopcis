import { IsString } from 'class-validator';

export class GetAiSuggestionsDto {
  @IsString()
  readonly text: string;
}
