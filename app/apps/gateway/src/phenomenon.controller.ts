import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePhenomenonDto } from './dto/create-phenomenon.dto';
import { PhenomenonService } from './phenomenon.service';

@Controller('phenomenon')
export class PhenomenonController {
  constructor(private readonly phenomenonService: PhenomenonService) {}

  @Post()
  createPhenomenon(@Body() createPhenomenonDto: CreatePhenomenonDto) {
    return this.phenomenonService.createPhenomenon(createPhenomenonDto);
  }

  @Get(':articleId')
  getPhenomenonCard(@Param('articleId') articleId: string) {
    return this.phenomenonService.getPhenomenonCard(articleId);
  }
}
