import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Start date in ISO string format',
    // example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  readonly startDate?: string; // Start date (ISO string)

  @ApiPropertyOptional({
    description: 'End date in ISO string format',
    // example: '2023-01-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  readonly endDate?: string; // End date (ISO string)
}
