/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionType } from '../enums';

export interface IActionLog {
  id: string;
  actionType: ActionType;
  userId: string;
  agencyId?: string;
  createdAt: Date;
  metadata?: {
    requestTime?: string;
    offerId?: string;
    [key: string]: any;
  };
}

export interface ActionLogQuery {
  actionType?: ActionType;
  userId?: string;
  agencyId?: string;
  createdAt?: {
    startDate?: Date;
    endDate?: Date;
  };
}
