import { Injectable } from '@nestjs/common';

@Injectable()
export class MarkdownRenderer {
  render(markdown: string): string {
    const lines = markdown.split(/\r?\n/);
    const html: string[] = [];
    let listOpen = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        if (listOpen) {
          html.push('</ul>');
          listOpen = false;
        }
        continue;
      }

      const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
      if (headingMatch) {
        if (listOpen) {
          html.push('</ul>');
          listOpen = false;
        }
        const level = headingMatch[1].length;
        html.push(
          `<h${level}>${this.renderInline(headingMatch[2].trim())}</h${level}>`,
        );
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        if (!listOpen) {
          html.push('<ul>');
          listOpen = true;
        }
        html.push(
          `<li>${this.renderInline(line.replace(/^[-*]\s+/, ''))}</li>`,
        );
        continue;
      }

      html.push(`<p>${this.renderInline(line)}</p>`);
    }

    if (listOpen) {
      html.push('</ul>');
    }

    return html.join('');
  }

  private renderInline(content: string): string {
    const escaped = this.escapeHtml(content);
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
