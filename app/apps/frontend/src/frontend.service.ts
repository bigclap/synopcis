import { Injectable, NotFoundException } from '@nestjs/common';
import { ManifestRenderer, ViewerContextInput, createDemoPageRegistry } from '@synop/rendering';
import { ManifestQueryDto } from './dto/manifest-query.dto';
import { RenderPageDto } from './dto/render-page.dto';
import { ViewerContextDto } from './dto/viewer.dto';

@Injectable()
export class FrontendService {
  private readonly registry = createDemoPageRegistry();

  constructor(private readonly renderer: ManifestRenderer) {}

  manifest(query: ManifestQueryDto) {
    const resolved = this.registry.resolve(query.slug);
    if (!resolved) {
      throw new NotFoundException(`Manifest for slug ${query.slug} not found`);
    }

    return {
      metadata: resolved.metadata,
      manifest: resolved.manifest,
      staticContentKeys: Object.keys(resolved.content),
    };
  }

  async render(dto: RenderPageDto) {
    const resolved = this.registry.resolve(dto.slug);
    if (!resolved) {
      throw new NotFoundException(`Page ${dto.slug} not found`);
    }

    const viewer = this.toViewerContext(dto.viewer);
    const rendered = await this.renderer.renderPage(resolved.manifest, {
      viewer,
      content: resolved.content,
      dataProvider: resolved.createHydrationProvider(),
    });

    return {
      metadata: resolved.metadata,
      rendered,
    };
  }

  private toViewerContext(viewer?: ViewerContextDto): ViewerContextInput {
    return {
      id: viewer?.id ?? null,
      roles: viewer?.roles ?? [],
      attributes: viewer?.attributes ?? {},
    };
  }
}
