import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class FieldSelectorDto {
  @ApiPropertyOptional({
    description: 'List of fields to include in the response',
    type: [String],
    // example: ['name', 'age', 'email'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly fields?: string[]; // List of fields to include in the response
}
