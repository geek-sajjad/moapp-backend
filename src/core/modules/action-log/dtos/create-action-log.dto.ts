/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ActionType } from '../enums/action-type.enum';

export class CreateActionLogDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ActionType)
  @IsNotEmpty()
  actionType: ActionType;

  @IsString()
  @IsNotEmpty()
  module: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsUUID()
  @IsOptional()
  relatedEntityId?: string;
}
