import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UUID validation DTO for query parameters
 * Example usage:
 * @Get()
 * async findByUUID(@Query() uuidQuery: UUIDQueryDto) {
 *   return this.service.findByUUID(uuidQuery.uuid);
 * }
 */
export class UUIDQueryDto {
  @IsUUID('4', { message: 'validation.INVALID_UUID' })
  @ApiProperty({
    description: 'UUID to query',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uuid: string;
}
