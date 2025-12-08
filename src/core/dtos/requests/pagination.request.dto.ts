import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from 'src/core/constants';
import { SortOrder } from 'src/core/enums';

/**
 * @deprecated Use SearchPaginationDto instead for pagination with search functionality
 */
export class PaginationDto {
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
  readonly page_size?: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.ASC;
}
