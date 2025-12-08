import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic enum validation DTO for parameters
 */
export class EnumParamDto<T extends Record<string, string | number>> {
  @IsEnum(null as T, { message: 'validation.INVALID_ENUM' })
  @ApiProperty({
    description: 'Enum value',
    enum: null,
  })
  value: T;
}

/**
 * Example of a concrete implementation:
 *
 * export class ProductTypeParamDto {
 *   @IsEnum(ProductType, { message: 'validation.INVALID_ENUM' })
 *   @ApiProperty({
 *     description: 'Product type',
 *     enum: ProductType,
 *     example: ProductType.PACKAGE,
 *   })
 *   type: ProductType;
 * }
 */
