import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import * as moment from 'moment';

export class ArrayPageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  readonly meta: Record<string, string | number | boolean>;

  constructor(data: T[]) {
    this.data = data;
    this.meta = {
      timestamp: Date.now(),
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  }
}
