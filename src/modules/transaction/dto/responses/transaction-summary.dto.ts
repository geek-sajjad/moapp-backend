import { ApiProperty } from '@nestjs/swagger';

export class TransactionSummaryDto {
  @ApiProperty({
    description: 'Total amount they owe me (CREDIT)',
    example: 100000,
  })
  totalCredit: number;

  @ApiProperty({
    description: 'Total amount I owe them (DEBIT)',
    example: 50000,
  })
  totalDebit: number;

  @ApiProperty({
    description:
      'Net balance (positive means they owe me, negative means I owe them)',
    example: 50000,
  })
  balance: number;

  @ApiProperty({
    description: 'Total number of transactions',
    example: 15,
  })
  totalTransactions: number;
}
