import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto, UpdateWorkLogDto, WorkLogFiltersDto } from './dto';

@Controller('work-logs')
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}

  @Get()
  findAll(@Query() filters: WorkLogFiltersDto) {
    return this.workLogsService.findAll(filters);
  }

  @Post()
  create(@Body() dto: CreateWorkLogDto) {
    return this.workLogsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWorkLogDto) {
    return this.workLogsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workLogsService.remove(id);
  }
}
