import { Test, TestingModule } from '@nestjs/testing';
import { WorkTypesService } from './work-types.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WorkTypesService', () => {
  let service: WorkTypesService;
  const prisma = {
    workType: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkTypesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<WorkTypesService>(WorkTypesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('loads work types sorted by name', async () => {
    prisma.workType.findMany.mockResolvedValue([]);

    await service.findAll();

    expect(prisma.workType.findMany).toHaveBeenCalledWith({
      orderBy: {
        name: 'asc',
      },
    });
  });
});
