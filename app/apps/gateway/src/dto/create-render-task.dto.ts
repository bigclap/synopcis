import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { RenderTaskViewerDto } from './render-task-viewer.dto';

export class CreateRenderTaskDto {
  @IsString()
  slug!: string;

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'] }, { message: 'source must be a valid URL' })
  source?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RenderTaskViewerDto)
  viewer?: RenderTaskViewerDto;
}
