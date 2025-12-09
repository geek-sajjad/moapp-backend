import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { TransactionTypeEnum } from '../../enums';

export class UpdateTransactionDto {
  @ApiProperty({
    description: 'Transaction amount',
    example: 50000,
    required: false,
  })
  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @Min(0, { message: 'validation.MIN_0' })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15',
    required: false,
  })
  @IsDateString({}, { message: 'validation.INVALID_DATE' })
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'Transaction type (DEBIT: I owe them, CREDIT: They owe me)',
    enum: TransactionTypeEnum,
    example: TransactionTypeEnum.CREDIT,
    required: false,
  })
  @IsEnum(TransactionTypeEnum, { message: 'validation.INVALID_ENUM' })
  @IsOptional()
  type?: TransactionTypeEnum;

  @ApiProperty({
    description: 'Transaction description or note',
    example: 'Payment for lunch',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  description?: string;
}
