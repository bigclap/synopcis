import { Test, TestingModule } from '@nestjs/testing';
import { PhenomenonController } from './phenomenon.controller';
import { PhenomenonService } from './phenomenon.service';
import { PhenomenonStorageService } from '@synop/domains';
import { GatewayService } from '../gateway/gateway.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('PhenomenonController', () => {
  let controller: PhenomenonController;

  const mockPhenomenonService = {
    getPhenomenonCard: jest.fn(),
  };

  const mockPhenomenonStorageService = {
    createPhenomenon: jest.fn(),
  };

  const mockGatewayService = {
    scheduleAiDraft: jest.fn(),
    scheduleAiSuggestions: jest.fn(),
  };

  const mockAuthService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhenomenonController],
      providers: [
        { provide: PhenomenonService, useValue: mockPhenomenonService },
        { provide: PhenomenonStorageService, useValue: mockPhenomenonStorageService },
        { provide: GatewayService, useValue: mockGatewayService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { id: 'test-user-id', nickname: 'test-user', email: 'test-user@synop.one' };
        return true;
      }})
      .compile();

    controller = module.get<PhenomenonController>(PhenomenonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPhenomenon', () => {
    it('should create a phenomenon', async () => {
      const req = { user: { id: 'test-user-id', nickname: 'test-user', email: 'test-user@synop.one' } };
      const body = { title: 'test' };
      mockPhenomenonStorageService.createPhenomenon.mockResolvedValue({ id: '1', slug: 'test' });

      await controller.createPhenomenon(body, req as any);

      expect(mockPhenomenonStorageService.createPhenomenon).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'test',
          title: 'test',
          author: { name: 'test-user', email: 'test-user@synop.one' },
          userId: 'test-user-id',
        }),
      );
    });
  });
});
