import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { TransactionTypeEnum } from '../../enums';

export class TransactionResponseDto {
  @AutoMap()
  @ApiProperty({
    description: 'Transaction ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction amount',
    example: 50000,
  })
  amount: number;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15',
  })
  date: Date;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionTypeEnum,
    example: TransactionTypeEnum.CREDIT,
  })
  type: TransactionTypeEnum;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction description',
    example: 'Payment for lunch',
    nullable: true,
  })
  description?: string;

  @AutoMap()
  @ApiProperty({
    description: 'Contact ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  contactId: string;

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
