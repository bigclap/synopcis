import { Test, TestingModule } from '@nestjs/testing';
import { PhenomenonController } from './phenomenon.controller';
import { PhenomenonService } from './phenomenon.service';

describe('PhenomenonController', () => {
  let controller: PhenomenonController;
  let service: PhenomenonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhenomenonController],
      providers: [
        {
          provide: PhenomenonService,
          useValue: {
            getPhenomenonCard: jest.fn((articleId) => ({
              articleId,
              properties: [],
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<PhenomenonController>(PhenomenonController);
    service = module.get<PhenomenonService>(PhenomenonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPhenomenonCard', () => {
    it('should call the phenomenon service', async () => {
      const articleId = '123';
      const spy = jest.spyOn(service, 'getPhenomenonCard');
      await controller.getPhenomenonCard(articleId);
      expect(spy).toHaveBeenCalledWith(articleId);
    });
  });
});
