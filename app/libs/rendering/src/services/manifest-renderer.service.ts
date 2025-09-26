import { Injectable } from '@nestjs/common';
import { MarkdownRenderer } from '@synop/shared-kernel';
import {
  ComponentManifestBlock,
  FrontendManifest,
  ManifestBlock,
  MarkdownManifestBlock,
  RenderOptions,
  RenderedBlock,
  RenderedPage,
  StaticManifestBlock,
} from '../types/manifest.types';
import { HydrationOrchestrator } from './hydration-orchestrator.service';
import { ViewerContext, ViewerContextInput } from '../types/viewer.types';

@Injectable()
export class ManifestRenderer {
  constructor(
    private readonly markdownRenderer: MarkdownRenderer,
    private readonly hydration: HydrationOrchestrator,
  ) {}

  async renderPage(manifest: FrontendManifest, options: RenderOptions): Promise<RenderedPage> {
    const viewer = this.normalizeViewer(options.viewer);
    const htmlParts: string[] = [];
    const blocks: RenderedBlock[] = [];

    for (const block of manifest.layout) {
      const html = this.renderBlock(block, options);
      htmlParts.push(html);
      blocks.push({
        id: block.id,
        type: block.type,
        html,
        hydrationId: block.type === 'component' ? block.hydrationId : undefined,
        cache: block.cache,
      });
    }

    const hydrationPlan = await this.hydration.buildPlan(manifest.hydrations, {
      viewer,
      dataProvider: options.dataProvider,
      now: options.now ?? new Date(),
      defaultRefreshIntervalMs: options.defaultHydrationIntervalMs ?? 15_000,
    });

    return {
      manifest: {
        version: manifest.version,
        generatedAt: manifest.generatedAt,
      },
      html: htmlParts.join(''),
      blocks,
      hydration: hydrationPlan,
    };
  }

  private renderBlock(block: ManifestBlock, options: RenderOptions): string {
    switch (block.type) {
      case 'static':
        return this.renderStaticBlock(block, options);
      case 'markdown':
        return this.renderMarkdownBlock(block, options);
      case 'component':
        return this.renderComponentBlock(block, options);
      default:
        throw new Error(`Unsupported block type ${(block as ManifestBlock).type}`);
    }
  }

  private renderStaticBlock(block: StaticManifestBlock, options: RenderOptions): string {
    const content = this.resolveContent(block.htmlKey, options);
    return this.wrapBlock(block, content);
  }

  private renderMarkdownBlock(block: MarkdownManifestBlock, options: RenderOptions): string {
    const markdown =
      block.markdown ??
      (block.markdownKey ? this.resolveContent(block.markdownKey, options) : undefined) ??
      (block.contentKey ? this.resolveContent(block.contentKey, options) : undefined);

    if (markdown === undefined) {
      throw new Error(`Missing markdown content for block ${block.id}`);
    }

    const rendered = this.markdownRenderer.render(markdown);
    const wrapper = block.wrapper ?? 'section';
    return `<${wrapper} data-block-id="${block.id}" data-block-type="markdown">${rendered}</${wrapper}>`;
  }

  private renderComponentBlock(block: ComponentManifestBlock, options: RenderOptions): string {
    const placeholder =
      block.placeholderHtml ??
      (block.placeholderKey ? this.resolveContent(block.placeholderKey, options, false) : undefined) ??
      (block.contentKey ? this.resolveContent(block.contentKey, options, false) : undefined) ??
      '<div class="component-skeleton">Loading…</div>';

    const props = block.props ? ` data-props='${this.serializeProps(block.props)}'` : '';
    const hydrationAttr = block.hydrationId
      ? ` data-hydration-id="${block.hydrationId}"`
      : '';

    return [
      '<div',
      ` data-block-id="${block.id}"`,
      ' data-block-type="component"',
      ` data-component="${block.component}"`,
      hydrationAttr,
      props,
      '>',
      placeholder,
      '</div>',
    ].join('');
  }

  private wrapBlock(block: ManifestBlock, content: string): string {
    return `<div data-block-id="${block.id}" data-block-type="${block.type}">${content}</div>`;
  }

  private resolveContent(
    key: string,
    options: RenderOptions,
    required = true,
  ): string {
    const source = options.content ?? {};
    const value = source[key];

    if (value === undefined) {
      if (!required) {
        return '';
      }
      throw new Error(`Missing content for key ${key}`);
    }

    return value;
  }

  private serializeProps(props: Record<string, unknown>): string {
    return JSON.stringify(props).replace(/'/g, '\\u0027');
  }

  private normalizeViewer(input: ViewerContextInput): ViewerContext {
    const roles = input.roles ? [...input.roles] : [];
    const attributes = input.attributes ? { ...input.attributes } : {};
    const id = input.id ?? undefined;

    return {
      id: id ?? undefined,
      roles,
      attributes,
      isAuthenticated: Boolean(id),
    };
  }
}
