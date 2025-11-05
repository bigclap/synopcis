import { ApiProperty } from '@nestjs/swagger';

export class CardLinkDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  slug: string;
}

export class CardPropertyDto {
  @ApiProperty()
  property: CardLinkDto;

  @ApiProperty()
  value: CardLinkDto;
}

export class PhenomenonCardDataDto {
  @ApiProperty({ type: [CardPropertyDto] })
  properties: CardPropertyDto[];
}

export class BlockDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: ['heading', 'paragraph'] })
  type: 'heading' | 'paragraph';

  @ApiProperty({
    required: false,
    enum: [1, 2, 3, 4, 5, 6],
  })
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  @ApiProperty()
  sort: number;

  @ApiProperty({ required: false })
  sourceUrl?: string;

  @ApiProperty({ required: false })
  alternativesCount?: number;
}

export class PhenomenonDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  lang_code: string;

  @ApiProperty({ type: [BlockDto] })
  blocks: BlockDto[];

  @ApiProperty()
  cardData: PhenomenonCardDataDto;
}

export class CreatePhenomenonRequestDto {
  @ApiProperty()
  title: string;
}
