import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkLogsModule } from './work-logs/work-logs.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkTypesModule } from './work-types/work-types.module';

@Module({
  imports: [WorkLogsModule, PrismaModule, WorkTypesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
