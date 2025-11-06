import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreatePhenomenonDto } from './dto/create-phenomenon.dto';
import { PhenomenonService } from './phenomenon.service';
import { CreatePhenomenonInput, PhenomenonStorageService } from '@synop/domains';
import { GatewayService } from './gateway.service';
import { CreateAiDraftTaskDto } from './dto/create-ai-draft-task.dto';
import { GetAiSuggestionsDto } from './dto/get-ai-suggestions.dto';
import { PhenomenonDto } from './dto/phenomenon.dto';
import { AuthService } from './auth.service';

@ApiTags('phenomena')
@Controller('phenomena')
export class PhenomenonController {
  constructor(
    private readonly phenomenonStorage: PhenomenonStorageService,
    private readonly gateway: GatewayService,
    private readonly phenomenonService: PhenomenonService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new phenomenon' })
  @ApiCreatedResponse({
    description: 'The newly created phenomenon.',
    type: PhenomenonDto,
  })
  async createPhenomenon(
    @Body() body: CreatePhenomenonDto,
    @Req() request: Request,
  ) {
    const userId = this.authService.getUserIdFromRequest(request);
    const slug = this.slugify(body.title);
    const author = { name: 'hardcoded-user', email: 'hardcoded-user@synop.one' };

    const input: CreatePhenomenonInput = {
      slug,
      title: body.title,
      author,
      userId,
    };

    return this.phenomenonStorage.createPhenomenon(input);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a phenomenon by slug' })
  @ApiOkResponse({
    description: 'The phenomenon.',
    type: PhenomenonDto,
  })
  async getPhenomenonCard(@Param('slug') slug: string) {
    return this.phenomenonService.getPhenomenonCard(slug);
  }

  @Post(':slug/ai-draft')
  @ApiOperation({ summary: 'Create an AI draft for a phenomenon' })
  async createAiDraft(
    @Param('slug') slug: string,
    @Body() body: CreateAiDraftTaskDto,
    @Req() request: Request,
  ) {
    const userId = this.authService.getUserIdFromRequest(request);
    return this.gateway.scheduleAiDraft({
      ...body,
      phenomenonSlug: slug,
      userId,
    });
  }

  @Post(':slug/suggestions')
  @ApiOperation({ summary: 'Get AI suggestions for a phenomenon' })
  async getAiSuggestions(
    @Param('slug') slug: string,
    @Body() body: GetAiSuggestionsDto,
    @Req() request: Request,
  ) {
    const userId = this.authService.getUserIdFromRequest(request);
    return this.gateway.scheduleAiSuggestions({
      ...body,
      phenomenonSlug: slug,
      userId,
    });
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
