import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ViewerContextDto } from './viewer.dto';

export class RenderPageDto {
  @IsString()
  slug!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ViewerContextDto)
  viewer?: ViewerContextDto;
}
