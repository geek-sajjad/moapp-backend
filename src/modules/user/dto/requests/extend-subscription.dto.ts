import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ExtendSubscriptionDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'New subscription end date',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  subscriptionEndDate: Date;
}
