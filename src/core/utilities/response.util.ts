import * as moment from 'moment';
import {
  ArrayPageDto,
  PageDto,
  ResponseDto,
  SinglePageDto,
} from '../dtos/responses';

import { IPageMeta } from '../interfaces';

export class ResponseUtil {
  static success<T>(
    messageKey: string,
    data: T,
    meta?: Record<string, string | number | boolean>,
  ): ResponseDto<T> {
    const defaultMeta = {
      timestamp: Date.now(),
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    const mergedMeta = { ...defaultMeta, ...meta };

    return new ResponseDto<T>(messageKey, data, mergedMeta);
  }

  static singleData<T>(data: T): SinglePageDto<T> {
    return new SinglePageDto<T>(data);
  }

  static arrayData<T>(data: T[]): ArrayPageDto<T> {
    return new ArrayPageDto<T>(data);
  }

  // TODO: change class name to MultiPageDto
  static paginatedData<T>(data: T[], meta?: IPageMeta): PageDto<T> {
    return new PageDto<T>(data, meta);
  }
}
