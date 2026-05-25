import { Test, TestingModule } from '@nestjs/testing';
import { WorkLogsService } from './work-logs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WorkLogsService', () => {
  let service: WorkLogsService;
  const prisma = {
    workLog: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    workType: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkLogsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<WorkLogsService>(WorkLogsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('loads logs with optional date filters and work type relation', async () => {
    prisma.workLog.findMany.mockResolvedValue([]);

    await service.findAll({ from: '2026-05-01', to: '2026-05-25' });

    expect(prisma.workLog.findMany).toHaveBeenCalledWith({
      where: {
        workDate: {
          gte: new Date('2026-05-01'),
          lte: new Date('2026-05-25'),
        },
      },
      include: {
        workType: true,
      },
      orderBy: {
        workDate: 'desc',
      },
    });
  });

  it('rejects creation for unknown work type', async () => {
    prisma.workType.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        workDate: '2026-05-25',
        workTypeId: 999,
        volume: 10,
        unit: 'м³',
        performerName: 'Иван Иванов',
      }),
    ).rejects.toThrow('Work type not found');
  });
});
