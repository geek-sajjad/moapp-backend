import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from './page-options.request.dto';

export class SearchPaginationDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Search term for filtering results',
    example: 'keyword',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;

  get skip(): number {
    return super.skip;
  }
}
