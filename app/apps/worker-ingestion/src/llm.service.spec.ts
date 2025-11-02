import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from './llm.service';
import axios from 'axios';

jest.mock('axios');

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmService],
    }).compile();

    service = module.get<LlmService>(LlmService);
  });

  it('should synthesize articles', async () => {
    const articles = [{ lang: 'en', content: 'test content' }];
    const synthesizedContent = 'synthesized content';
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        choices: [{ message: { content: synthesizedContent } }],
      },
    });

    const result = await service.synthesize(articles);

    expect(axios.post).toHaveBeenCalledWith(
      'http://ai-chat:8000/v1/chat/completions',
      {
        model: 'Qwen/Qwen3-Omni-30B-A3B-Instruct',
        messages: [
          {
            role: 'user',
            content: 'Synthesize the following articles into a single, neutral "common edition".\n\n--- en ---\ntest content',
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    expect(result).toBe(synthesizedContent);
  });

  it('should translate text', async () => {
    const text = 'test text';
    const targetLang = 'es';
    const translatedText = 'translated text';
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        choices: [{ message: { content: translatedText } }],
      },
    });

    const result = await service.translate(text, targetLang);

    expect(axios.post).toHaveBeenCalledWith(
      'http://ai-chat:8000/v1/chat/completions',
      {
        model: 'Qwen/Qwen3-Omni-30B-A3B-Instruct',
        messages: [
          {
            role: 'user',
            content: 'Translate the following text to es:\n\n' + text,
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    expect(result).toBe(translatedText);
  });
});
