/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Scope, Optional, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActionLogRepository,
  QueryOptions,
  ActionStats,
} from '../repositories';
import { CreateActionLogDto } from '../dtos';
import { ActionType, ActionCategory, getActionCategory } from '../enums';
import { ActionLog } from '../entities/action-log.entity';

@Injectable({ scope: Scope.REQUEST })
export class ActionLogService {
  private request?: Request;

  constructor(
    private readonly actionLogRepository: ActionLogRepository,
    @Optional() @Inject(REQUEST) request: Request,
    @InjectRepository(ActionLog)
    private readonly actionLogRepo: Repository<ActionLog>,
  ) {
    this.request = request;
  }

  private getRequestInfo() {
    return {
      ipAddress: this.request?.ip || '',
      userAgent: this.request?.headers?.['user-agent'] || '',
    };
  }

  async logAction(
    userId: string,
    actionType: ActionType,
    module: string,
    options: {
      metadata?: Record<string, any>;
      description?: string;
      relatedEntityId?: string;
      ipAddress?: string;
      userAgent?: string;
    } = {},
  ): Promise<ActionLog> {
    const requestInfo = this.getRequestInfo();

    const actionLogDto: CreateActionLogDto = {
      userId,
      actionType,
      module,
      metadata: options.metadata,
      description: options.description,
      ipAddress: options.ipAddress || requestInfo.ipAddress,
      userAgent: options.userAgent || requestInfo.userAgent,
      relatedEntityId: options.relatedEntityId,
    };

    return this.actionLogRepository.create(actionLogDto);
  }

  async logSystemAction(
    actionType: ActionType,
    module: string,
    systemUserId: string,
    options: {
      metadata?: Record<string, any>;
      description?: string;
      relatedEntityId?: string;
    } = {},
  ): Promise<ActionLog> {
    const actionLogDto: CreateActionLogDto = {
      userId: systemUserId,
      actionType,
      module,
      metadata: options.metadata,
      description: options.description,
      relatedEntityId: options.relatedEntityId,
    };

    return this.actionLogRepository.create(actionLogDto);
  }

  async getUserActions(
    userId: string,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    return this.actionLogRepository.findByUserId(userId, options);
  }

  async getModuleActions(
    module: string,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    return this.actionLogRepository.findByModule(module, options);
  }

  async getActionsByType(
    actionType: ActionType,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    return this.actionLogRepository.findByActionType(actionType, options);
  }

  async getActionStats(options?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'actionType' | 'module' | 'userId';
  }): Promise<ActionStats[]> {
    return this.actionLogRepository.getStats(options);
  }

  async getActionsByCategory(
    category: ActionCategory,
    options?: QueryOptions,
  ): Promise<{ data: ActionLog[]; total: number }> {
    return this.actionLogRepository.findByCategory(category, options);
  }

  async getActionStatsByCategory(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ActionStats[]> {
    return this.actionLogRepository.getStatsByCategory(options);
  }

  getActionCategory(actionType: ActionType): ActionCategory {
    return getActionCategory(actionType);
  }

  async find(query: Partial<ActionLog>): Promise<ActionLog[]> {
    return this.actionLogRepo.find({
      where: query,
      relations: ['user'],
    });
  }

  async create(actionLog: Partial<ActionLog>): Promise<ActionLog> {
    const createdLog = this.actionLogRepo.create(actionLog);
    return this.actionLogRepo.save(createdLog);
  }
}
