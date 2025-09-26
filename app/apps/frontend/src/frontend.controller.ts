import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ManifestQueryDto } from './dto/manifest-query.dto';
import { RenderPageDto } from './dto/render-page.dto';
import { FrontendService } from './frontend.service';

@Controller('frontend')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) {}

  @Get('manifest')
  manifest(@Query() query: ManifestQueryDto) {
    return this.frontendService.manifest(query);
  }

  @Post('render')
  render(@Body() dto: RenderPageDto) {
    return this.frontendService.render(dto);
  }
}
