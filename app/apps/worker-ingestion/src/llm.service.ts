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
}
