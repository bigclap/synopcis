import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class ViewerContextDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;
}
