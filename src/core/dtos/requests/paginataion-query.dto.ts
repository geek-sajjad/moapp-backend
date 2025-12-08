import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from 'src/core/constants';
// import { SortDto } from './sort.dto';

/**
 * @deprecated Use SearchPaginationDto instead for pagination with search functionality
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: MIN_PAGE_SIZE,
    maximum: MAX_PAGE_SIZE,
    default: DEFAULT_PAGE_SIZE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(MIN_PAGE_SIZE)
  @Max(MAX_PAGE_SIZE)
  readonly limit: number = DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({
    description: 'Search term',
    example: 'keyword',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
