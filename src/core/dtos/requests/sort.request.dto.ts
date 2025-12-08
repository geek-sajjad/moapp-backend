import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

/**
 * @deprecated Use the unified SortDto from sort.dto.ts instead
 */
export class LegacySortDto {
  @ApiPropertyOptional({
    description: 'Sorting by',
  })
  @IsOptional()
  @IsString()
  readonly sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sorting order',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly order: 'ASC' | 'DESC' = 'ASC';
}
