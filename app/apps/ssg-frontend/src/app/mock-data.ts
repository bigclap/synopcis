import { Phenomenon, Block } from '@/types/phenomenon';

export const mockPhenomena: Phenomenon[] = [
  {
    id: '1',
    slug: 'lorem-ipsum',
    title: 'The lorem ipsum dolor sit amet',
    lang_code: 'en',
    blocks: [
      {
        id: 'b1-1',
        content: 'The Definition of Lorem Ipsum',
        type: 'heading',
        level: 2,
        sort: 1,
        sourceUrl: 'https://www.lipsum.com/',
        alternativesCount: 2,
      },
      {
        id: 'b1-2',
        content: 'The lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        type: 'paragraph',
        sort: 2,
        sourceUrl: 'https://www.lipsum.com/',
        alternativesCount: 5,
      },
      {
        id: 'b1-3',
        content: 'Where does it come from?',
        type: 'heading',
        level: 3,
        sort: 3,
      },
      {
        id: 'b1-4',
        content: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        type: 'paragraph',
        sort: 4,
        sourceUrl: 'https://www.lipsum.com/',
        alternativesCount: 0,
      },
    ],
    cardData: {
      properties: [
        {
          property: { text: 'Type', slug: 'type' },
          value: { text: 'Placeholder Text', slug: 'placeholder-text' },
        },
      ],
    },
  },
  {
    id: '2',
    slug: 'industrial-revolution',
    title: 'The Industrial Revolution',
    lang_code: 'en',
    blocks: [
      {
        id: 'b2-1',
        content: 'A period of major industrialization that took place during the late 1700s and early 1800s.',
        type: 'paragraph',
        sort: 1,
        sourceUrl: 'https://en.wikipedia.org/wiki/Industrial_Revolution',
        alternativesCount: 1,
      },
    ],
    cardData: {
      properties: [
        {
          property: { text: 'Period', slug: 'period' },
          value: { text: '18th-19th Century', slug: '18th-19th-century' },
        },
      ],
    },
  },
];

export const mockConcepts = [
  {
    key: 'lorem-ipsum',
    label: 'Lorem Ipsum',
    type: 'concept',
  },
  {
    key: 'industrial-revolution',
    label: 'Industrial Revolution',
    type: 'concept',
  },
  {
    key: 'renaissance',
    label: 'Renaissance',
    type: 'concept',
  },
];

export const mockPhenomenonProperties = [
  {
    property: 'Born',
    value: 'March 14, 1879',
  },
  {
    property: 'Died',
    value: 'April 18, 1955',
  },
  {
    property: 'Citizenship',
    value: 'Germany, Switzerland, United States',
  },
];
