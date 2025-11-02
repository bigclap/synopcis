import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly chatUrl = 'http://ai-chat:8000/v1/chat/completions';

  async synthesize(articles: { lang: string; content: string }[]): Promise<string> {
    this.logger.log(`Synthesizing ${articles.length} articles.`);
    const prompt = this.createSynthesisPrompt(articles);
    return this.callChatApi(prompt);
  }

  async translate(text: string, targetLang: string): Promise<string> {
    this.logger.log(`Translating text to ${targetLang}.`);
    const prompt = this.createTranslationPrompt(text, targetLang);
    return this.callChatApi(prompt);
  }

  async generateBlocks(content: string): Promise<any[]> {
    this.logger.log('Generating blocks from content.');
    const prompt = this.createGenerateBlocksPrompt(content);
    const result = await this.callChatApi(prompt);
    try {
      return JSON.parse(result);
    } catch (error) {
      this.logger.error('Error parsing JSON from chat API', error);
      return [];
    }
  }

  private async callChatApi(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.chatUrl,
        {
          model: 'Qwen/Qwen3-Omni-30B-A3B-Instruct',
          messages: [{ role: 'user', content: prompt }],
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('Error calling chat API', error);
      throw error;
    }
  }

  private createSynthesisPrompt(articles: { lang: string; content: string }[]): string {
    const articlesContent = articles
      .map(({ lang, content }) => `--- ${lang} ---\n${content}`)
      .join('\n\n');
    return `Synthesize the following articles into a single, neutral "common edition".\n\n${articlesContent}`;
  }

  private createTranslationPrompt(text: string, targetLang: string): string {
    return `Translate the following text to ${targetLang}:\n\n${text}`;
  }

  private createGenerateBlocksPrompt(content: string): string {
    return `Split the following article into a structured JSON array of logical blocks based on the Synop project's manifest format.

Each block in the JSON array must be an object with the following fields:
- "type": (string) The type of block. Can be "heading", "text", "quote", or "image".
- "level": (number) The hierarchical level of the block (e.g., 1 for a main title, 2 for a section, 3 for a sub-section).
- "content": (string) The full Markdown content of the block.
- "title": (string, optional) A concise title for the block, often the content of a heading.
- "concepts": (string[], optional) An array of keywords or concepts related to the block's content.
- "source": (object, optional) An object describing the source of the information, with "type" ('web' or 'offline') and "url" or "identifier".

Here is an example of the expected output format:
\`\`\`json
[
  {
    "type": "heading",
    "level": 1,
    "content": "# Quantum Mechanics",
    "title": "Quantum Mechanics",
    "concepts": ["physics", "quantum"]
  },
  {
    "type": "text",
    "level": 2,
    "content": "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.",
    "concepts": ["definition", "physics"],
    "source": { "type": "web", "url": "https://en.wikipedia.org/wiki/Quantum_mechanics" }
  }
]
\`\`\`

Now, process the following article:
<article>
${content}
</article>
`;
  }
}
