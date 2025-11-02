import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreatePhenomenonInput, PhenomenonStorageService } from '@synop/domains';
import { GatewayService } from './gateway.service';
import { CreateAiDraftTaskDto } from './dto/create-ai-draft-task.dto';

interface CreatePhenomenonDto {
  readonly title: string;
}

interface AiDraftDto {
  readonly wikipediaArticle: string;
  readonly language: string;
}

@Controller('phenomena')
export class PhenomenonController {
  constructor(
    private readonly phenomenonStorage: PhenomenonStorageService,
    private readonly gateway: GatewayService,
  ) {}

  @Post()
  async createPhenomenon(
    @Body() body: CreatePhenomenonDto,
    @Req() request: Request,
  ) {
    const slug = this.slugify(body.title);
    const author = { name: 'hardcoded-user', email: 'hardcoded-user@synop.one' }; // TODO: get from session
    const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // TODO: get from session

    const input: CreatePhenomenonInput = {
      slug,
      title: body.title,
      author,
      userId,
    };

    return this.phenomenonStorage.createPhenomenon(input);
  }

  @Get(':slug')
  async getPhenomenonCard(@Param('slug') slug: string) {
    return `stub for ${slug}`;
  }

  @Post(':slug/ai-draft')
  async createAiDraft(
    @Param('slug') slug: string,
    @Body() body: CreateAiDraftTaskDto,
  ) {
    const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // TODO: get from session
    return this.gateway.scheduleAiDraft({
      ...body,
      phenomenonSlug: slug,
      userId,
    });
  }

  private slugify(text: string): string {
    return text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }
}
