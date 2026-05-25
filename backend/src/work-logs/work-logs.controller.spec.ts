import { Test, TestingModule } from '@nestjs/testing';
import { WorkLogsController } from './work-logs.controller';
import { WorkLogsService } from './work-logs.service';

describe('WorkLogsController', () => {
  let controller: WorkLogsController;
  const workLogsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkLogsController],
      providers: [
        {
          provide: WorkLogsService,
          useValue: workLogsService,
        },
      ],
    }).compile();

    controller = module.get<WorkLogsController>(WorkLogsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes date filters to service', async () => {
    const filters = { from: '2026-05-01', to: '2026-05-25' };

    await controller.findAll(filters);

    expect(workLogsService.findAll).toHaveBeenCalledWith(filters);
  });
});
