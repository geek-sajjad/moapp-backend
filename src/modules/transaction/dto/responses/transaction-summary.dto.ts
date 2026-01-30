import { ApiProperty } from '@nestjs/swagger';
import { TransactionTypeEnum } from '../../enums/transaction-type.enum';

export class TransactionSummaryDto {
  @ApiProperty({
    description: 'Total amount',
    example: 50000,
  })
  totalBalance: number;

  @ApiProperty({
    description: 'transaction type',
    example: 'CREDIT',
  })
  totalType: TransactionTypeEnum;

  @ApiProperty({
    description: 'Total number of transactions',
    example: 15,
  })
  totalTransactions: number;
}
