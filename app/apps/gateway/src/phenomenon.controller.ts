import { Controller, Get, Param } from '@nestjs/common';
import { PhenomenonService } from './phenomenon.service';

@Controller('phenomenon')
export class PhenomenonController {
  constructor(private readonly phenomenonService: PhenomenonService) {}

  @Get(':articleId')
  getPhenomenonCard(@Param('articleId') articleId: string) {
    return this.phenomenonService.getPhenomenonCard(articleId);
  }
}
