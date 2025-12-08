import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { IPageMeta } from 'src/core/interfaces';
import { PageMetaDto } from './page-meta.response.dto';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: IPageMeta) {
    this.data = data;
    this.meta = new PageMetaDto(meta);
  }
}
