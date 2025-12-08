import { ApiProperty } from '@nestjs/swagger';

export class FaqResponseDto {
  @ApiProperty({ description: 'Unique identifier of the FAQ' })
  id: string;

  @ApiProperty({ description: 'Question text' })
  question: string;

  @ApiProperty({ description: 'Answer text' })
  answer: string;

  @ApiProperty({ description: 'Order/position of the FAQ', default: 0 })
  order: number;

  @ApiProperty({ description: 'Whether the FAQ is active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
