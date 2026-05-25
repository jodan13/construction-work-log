import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkLogDto, UpdateWorkLogDto, WorkLogFiltersDto } from './dto';

@Injectable()
export class WorkLogsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: WorkLogFiltersDto = {}) {
    return this.prisma.workLog.findMany({
      where: {
        workDate: {
          ...(filters.from ? { gte: new Date(filters.from) } : {}),
          ...(filters.to ? { lte: new Date(filters.to) } : {}),
        },
      },
      include: {
        workType: true,
      },
      orderBy: {
        workDate: 'desc',
      },
    });
  }

  async create(dto: CreateWorkLogDto) {
    await this.assertWorkTypeExists(dto.workTypeId);

    return this.prisma.workLog.create({
      data: {
        ...dto,
        workDate: new Date(dto.workDate),
      },
      include: {
        workType: true,
      },
    });
  }

  async update(id: number, dto: UpdateWorkLogDto) {
    await this.assertExists(id);

    if (dto.workTypeId) {
      await this.assertWorkTypeExists(dto.workTypeId);
    }

    return this.prisma.workLog.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.workDate ? { workDate: new Date(dto.workDate) } : {}),
      },
      include: {
        workType: true,
      },
    });
  }

  async remove(id: number) {
    await this.assertExists(id);

    return this.prisma.workLog.delete({
      where: { id },
    });
  }

  private async assertExists(id: number) {
    const item = await this.prisma.workLog.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Work log not found');
    }
  }

  private async assertWorkTypeExists(id: number) {
    const item = await this.prisma.workType.findUnique({
      where: { id },
    });

    if (!item) {
      throw new BadRequestException('Work type not found');
    }
  }
}
