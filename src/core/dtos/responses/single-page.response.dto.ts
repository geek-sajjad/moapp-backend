import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';

export class SinglePageDto<T> {
  @ApiProperty()
  readonly data: T;

  readonly meta: Record<string, string | number | boolean>;

  constructor(data: T) {
    this.data = data;
    this.meta = {
      timestamp: Date.now(),
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  }
}
