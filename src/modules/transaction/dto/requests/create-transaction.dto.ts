import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { TransactionTypeEnum } from '../../enums';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction amount',
    example: 50000,
  })
  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @Min(0, { message: 'validation.MIN_0' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  amount: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'validation.INVALID_DATE' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  date: string;

  @ApiProperty({
    description: 'Transaction type (DEBIT: I owe them, CREDIT: They owe me)',
    enum: TransactionTypeEnum,
    example: TransactionTypeEnum.CREDIT,
  })
  @IsEnum(TransactionTypeEnum, { message: 'validation.INVALID_ENUM' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  type: TransactionTypeEnum;

  @ApiProperty({
    description: 'Transaction description or note',
    example: 'Payment for lunch',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Contact ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  contactId: string;
}
