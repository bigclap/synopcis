import { Injectable } from '@nestjs/common';
import { MarkdownRenderer } from '@synop/shared-kernel';

@Injectable()
export class FrontendService {
  constructor(private readonly markdownRenderer: MarkdownRenderer) {}

  manifest() {
    return {
      version: '0.1.0',
      generatedAt: new Date().toISOString(),
      hydration: 'dynamic',
    };
  }

  render(markdown: string) {
    return {
      html: this.markdownRenderer.render(markdown),
    };
  }
}
