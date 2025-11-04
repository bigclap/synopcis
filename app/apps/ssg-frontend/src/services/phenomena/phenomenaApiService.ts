import { Phenomenon } from '@/types/phenomenon';

export const createPhenomenon = async (
  title: string,
): Promise<Phenomenon> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newPhenomenon: Phenomenon = {
    id: Date.now().toString(),
    slug: title.toLowerCase().replace(/\s/g, '-'),
    title: title,
    lang_code: 'en',
    blocks: [],
    cardData: {
      properties: [],
    },
  };

  return newPhenomenon;
};

export const generateAIDraft = async (
  title: string,
): Promise<Phenomenon> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const newPhenomenon: Phenomenon = {
    id: Date.now().toString(),
    slug: title.toLowerCase().replace(/\s/g, '-'),
    title: title,
    lang_code: 'en',
    blocks: [
      {
        id: '1',
        content: `This is an AI-generated draft for ${title}.`,
        type: 'paragraph',
        sort: 1,
      },
    ],
    cardData: {
      properties: [
        {
          property: { text: 'Type', slug: 'type' },
          value: { text: 'AI-Generated', slug: 'ai-generated' },
        },
      ],
    },
  };

  return newPhenomenon;
};
