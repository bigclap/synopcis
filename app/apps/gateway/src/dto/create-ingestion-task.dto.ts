import { IsArray, IsString } from 'class-validator';

export class CreateIngestionTaskDto {
  @IsString()
  articleName!: string;

  @IsArray()
  @IsString({ each: true })
  languages!: string[];
}
