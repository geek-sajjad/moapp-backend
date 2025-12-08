import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLog } from './entities/action-log.entity';
import { ActionLogRepository } from './repositories/action-log.repository';
import { ActionLogService } from './services/action-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLog])],
  providers: [ActionLogRepository, ActionLogService],
  exports: [ActionLogService],
})
export class ActionLogModule {}
