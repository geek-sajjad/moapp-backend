import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class FatoorahInvoiceItemDto {
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  ItemName: string;

  @IsInt({ message: 'validation.MUST_BE_INTEGER' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  Quantity: number;

  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  UnitPrice: number;

  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @IsOptional()
  @Min(0.01, { message: 'validation.WEIGHT_MIN' })
  @Max(100, { message: 'validation.WEIGHT_MAX' })
  Weight?: number;

  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @IsOptional()
  @Min(0.01, { message: 'validation.WIDTH_MIN' })
  @Max(200, { message: 'validation.WIDTH_MAX' })
  Width?: number;

  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @IsOptional()
  @Min(0.01, { message: 'validation.HEIGHT_MIN' })
  @Max(160, { message: 'validation.HEIGHT_MAX' })
  Height?: number;

  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @IsOptional()
  @Min(0.01, { message: 'validation.DEPTH_MIN' })
  @Max(200, { message: 'validation.DEPTH_MAX' })
  Depth?: number;
}
