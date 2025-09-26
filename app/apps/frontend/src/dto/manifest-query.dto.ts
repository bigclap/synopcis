import { IsString } from 'class-validator';

export class ManifestQueryDto {
  @IsString()
  slug!: string;
}
