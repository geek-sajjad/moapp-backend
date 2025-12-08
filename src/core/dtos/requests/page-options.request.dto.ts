import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from 'src/core/constants';

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: DEFAULT_PAGE,
    default: DEFAULT_PAGE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(DEFAULT_PAGE)
  @IsOptional()
  readonly page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    minimum: MIN_PAGE_SIZE,
    maximum: MAX_PAGE_SIZE,
    default: DEFAULT_PAGE_SIZE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(MIN_PAGE_SIZE)
  @Max(MAX_PAGE_SIZE)
  @IsOptional()
  readonly take?: number = DEFAULT_PAGE_SIZE;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
