import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Debit amount (money out)',
    example: 50000,
    default: 0,
  })
  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @Min(0, { message: 'validation.MIN_0' })
  @IsOptional()
  debitAmount?: number;

  @ApiProperty({
    description: 'Credit amount (money in)',
    example: 30000,
    default: 0,
  })
  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @Min(0, { message: 'validation.MIN_0' })
  @IsOptional()
  creditAmount?: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'validation.INVALID_DATE' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  date: string;

  @ApiProperty({
    description: 'Transaction description or note',
    example: 'Payment for lunch',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  customerId: string;
}
