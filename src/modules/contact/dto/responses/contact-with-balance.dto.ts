import { ApiProperty } from '@nestjs/swagger';
import { ContactResponseDto } from './contact-response.dto';

export class ContactWithBalanceDto extends ContactResponseDto {
  @ApiProperty({
    description:
      'Total balance (positive means they owe me, negative means I owe them)',
    example: 15000,
  })
  balance: number;

  @ApiProperty({
    description: 'Total number of transactions',
    example: 5,
  })
  transactionCount: number;
}
