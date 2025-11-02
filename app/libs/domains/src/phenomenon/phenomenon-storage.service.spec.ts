import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  formatBlockFilePath,
  LocalGitRepositoryClient,
} from '@synop/shared-kernel';
import { PhenomenonBlockEntity } from './phenomenon-block.entity';
import { PhenomenonEntity } from './phenomenon.entity';
import {
  PhenomenonStorageService,
  UpdatePhenomenonBlocksInput,
} from './phenomenon-storage.service';
import { PhenomenonBlock, PhenomenonManifest } from './phenomenon.types';

const mockGitClient = {
  readFile: jest.fn(),
  commit: jest.fn(),
};

const mockPhenomenonRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockBlockRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('PhenomenonStorageService', () => {
  let service: PhenomenonStorageService;

  const phenomenonSlug = 'test-phenomenon';

  const MOCK_BLOCK: PhenomenonBlock = {
    lang: 'en',
    blockId: 1,
    label: 'Introduction',
    title: 'Biography',
    level: 1,
    content: '# Biography\n',
  };

  const MOCK_INPUT: UpdatePhenomenonBlocksInput = {
    phenomenonSlug,
    summary: 'Add content',
    sourceUrl: 'https://example.com/source',
    author: { name: 'Test Author' },
    blocks: [MOCK_BLOCK],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PhenomenonStorageService,
        {
          provide: LocalGitRepositoryClient,
          useValue: mockGitClient,
        },
        {
          provide: getRepositoryToken(PhenomenonEntity),
          useValue: mockPhenomenonRepository,
        },
        {
          provide: getRepositoryToken(PhenomenonBlockEntity),
          useValue: mockBlockRepository,
        },
      ],
    }).compile();

    service = module.get(PhenomenonStorageService);
    jest.clearAllMocks();
  });

  it('saves block metadata to the database and commits to git', async () => {
    mockGitClient.readFile.mockResolvedValue(null);
    mockGitClient.commit.mockResolvedValue({ hash: '123' });
    mockPhenomenonRepository.findOneBy.mockResolvedValue(null);
    mockPhenomenonRepository.create.mockReturnValue({ slug: phenomenonSlug });
    mockBlockRepository.findOneBy.mockResolvedValue(null);
    mockBlockRepository.create.mockImplementation((dto) => dto);

    await service.updatePhenomenonBlocks(MOCK_INPUT);

    // DB checks
    expect(mockPhenomenonRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ slug: phenomenonSlug }),
    );
    expect(mockBlockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        path: formatBlockFilePath(MOCK_BLOCK),
        title: MOCK_BLOCK.title,
        level: MOCK_BLOCK.level,
      }),
    );

    // Git checks
    const blockPath = formatBlockFilePath(MOCK_BLOCK);
    const expectedManifest: PhenomenonManifest = [
      { path: blockPath, title: MOCK_BLOCK.title, level: MOCK_BLOCK.level },
    ];
    expect(mockGitClient.commit).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: {
          [blockPath]: MOCK_BLOCK.content,
          'manifest.json': JSON.stringify(expectedManifest, null, 2),
        },
      }),
    );
  });
});
