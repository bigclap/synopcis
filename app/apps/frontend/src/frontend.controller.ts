import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RenderMarkdownDto } from './dto/render-markdown.dto';
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
  manifest() {
    return this.frontendService.manifest();
  }

  @Post('render')
  render(@Body() dto: RenderMarkdownDto) {
    return this.frontendService.render(dto.markdown);
  }
}
