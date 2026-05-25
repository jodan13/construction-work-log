import { Test, TestingModule } from '@nestjs/testing';
import { WorkTypesController } from './work-types.controller';
import { WorkTypesService } from './work-types.service';

describe('WorkTypesController', () => {
  let controller: WorkTypesController;
  const workTypesService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkTypesController],
      providers: [
        {
          provide: WorkTypesService,
          useValue: workTypesService,
        },
      ],
    }).compile();

    controller = module.get<WorkTypesController>(WorkTypesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates list loading to service', async () => {
    await controller.findAll();

    expect(workTypesService.findAll).toHaveBeenCalled();
  });
});
