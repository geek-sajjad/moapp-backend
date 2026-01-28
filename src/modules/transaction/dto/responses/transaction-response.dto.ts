import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class TransactionResponseDto {
  @AutoMap()
  @ApiProperty({
    description: 'Transaction ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    description: 'Debit amount (money out)',
    example: 50000,
  })
  debitAmount: number;

  @AutoMap()
  @ApiProperty({
    description: 'Credit amount (money in)',
    example: 30000,
  })
  creditAmount: number;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15',
  })
  date: Date;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction description',
    example: 'Payment for lunch',
    nullable: true,
  })
  description?: string;

  @AutoMap()
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @AutoMap()
  @ApiProperty({
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId: string;

  @AutoMap()
  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @AutoMap()
  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
