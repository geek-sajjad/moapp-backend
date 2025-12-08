import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In } from 'typeorm';
import { BaseRepository } from 'src/core/repositories';
import { ActionLog } from '../entities/action-log.entity';
import { CreateActionLogDto } from '../dtos';
import { ActionCategory, ActionType, getActionsByCategory } from '../enums';

export interface QueryOptions {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}

export interface ActionStats {
  id: string;
  count: number;
  lastAction: Date;
}

@Injectable()
export class ActionLogRepository {
  constructor(
    @InjectRepository(ActionLog)
    private actionLogRepository: BaseRepository<ActionLog>,
  ) {}

  async create(createActionLogDto: CreateActionLogDto): Promise<ActionLog> {
    const actionLog = this.actionLogRepository.create(createActionLogDto);
    return this.actionLogRepository.save(actionLog);
  }

  private buildDateQuery(options?: QueryOptions): FindOptionsWhere<ActionLog> {
    const where: FindOptionsWhere<ActionLog> = {};
    if (options?.startDate && options?.endDate) {
      where.createdAt = Between(options.startDate, options.endDate);
    } else if (options?.startDate) {
      where.createdAt = Between(options.startDate, new Date());
    } else if (options?.endDate) {
      where.createdAt = Between(new Date(0), options.endDate);
    }
    return where;
  }

  async findByUserId(
    userId: string,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    const where = {
      ...this.buildDateQuery(options),
      userId,
    };

    const [data, total] = await Promise.all([
      this.actionLogRepository.find({
        where,
        order: { createdAt: 'DESC' },
        skip: options?.skip || 0,
        take: options?.limit || 10,
        relations: ['user'],
      }),
      this.actionLogRepository.count({ where }),
    ]);

    return { data, total };
  }

  async findByModule(
    module: string,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    const where = {
      ...this.buildDateQuery(options),
      module,
    };

    const [data, total] = await Promise.all([
      this.actionLogRepository.find({
        where,
        order: { createdAt: 'DESC' },
        skip: options?.skip || 0,
        take: options?.limit || 10,
        relations: ['user'],
      }),
      this.actionLogRepository.count({ where }),
    ]);

    return { data, total };
  }

  async findByActionType(
    actionType: ActionType,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    const where = {
      ...this.buildDateQuery(options),
      actionType,
    };

    const [data, total] = await Promise.all([
      this.actionLogRepository.find({
        where,
        order: { createdAt: 'DESC' },
        skip: options?.skip || 0,
        take: options?.limit || 10,
        relations: ['user'],
      }),
      this.actionLogRepository.count({ where }),
    ]);

    return { data, total };
  }

  async findByCategory(
    category: ActionCategory,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    const actionTypes = getActionsByCategory(category);
    const where = {
      ...this.buildDateQuery(options),
      actionType: In(actionTypes),
    };

    const [data, total] = await Promise.all([
      this.actionLogRepository.find({
        where,
        order: { createdAt: 'DESC' },
        skip: options?.skip || 0,
        take: options?.limit || 10,
        relations: ['user'],
      }),
      this.actionLogRepository.count({ where }),
    ]);

    return { data, total };
  }

  async getStats(options?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'actionType' | 'module' | 'userId';
  }): Promise<ActionStats[]> {
    const where = this.buildDateQuery(options);
    const groupBy = options?.groupBy || 'actionType';
    const groupByField = groupBy === 'userId' ? 'user_id' : groupBy;

    const queryBuilder = this.actionLogRepository
      .createQueryBuilder('actionLog')
      .select(`actionLog.${groupByField}`, 'id')
      .addSelect('COUNT(*)', 'count')
      .addSelect('MAX(actionLog.createdAt)', 'lastAction')
      .where(where)
      .groupBy(`actionLog.${groupByField}`)
      .orderBy('count', 'DESC');

    return queryBuilder.getRawMany();
  }

  async getStatsByCategory(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ActionStats[]> {
    const where = this.buildDateQuery(options);

    const queryBuilder = this.actionLogRepository
      .createQueryBuilder('actionLog')
      .select("SPLIT_PART(actionLog.actionType, '.', 1)", 'id')
      .addSelect('COUNT(*)', 'count')
      .addSelect('MAX(actionLog.createdAt)', 'lastAction')
      .where(where)
      .groupBy("SPLIT_PART(actionLog.actionType, '.', 1)")
      .orderBy('count', 'DESC');

    return queryBuilder.getRawMany();
  }
}
