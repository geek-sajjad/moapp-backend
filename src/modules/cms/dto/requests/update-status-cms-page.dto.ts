import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateStatusCmsPageDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the page is active',
    default: true,
    required: false,
  })
  isActive?: boolean;
}
