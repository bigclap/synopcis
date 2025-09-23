import { IsString } from 'class-validator';

export class RenderMarkdownDto {
  @IsString()
  markdown!: string;
}
