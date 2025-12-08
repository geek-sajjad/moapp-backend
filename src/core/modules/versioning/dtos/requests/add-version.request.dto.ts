import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class AddVersionDto {
  @ApiProperty({
    description: 'Version number (e.g., "1.0.0")',
    example: '1.0.0',
    default: '1.0.0',
  })
  @IsString()
  version: string = '1.0.0';

  @ApiProperty({
    description: 'Whether this version requires a forced update',
    example: false,
    default: false,
  })
  @IsBoolean()
  forceUpdate: boolean = false;

  @ApiProperty({
    description: 'Release date of the version',
    example: '2025-01-27',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
