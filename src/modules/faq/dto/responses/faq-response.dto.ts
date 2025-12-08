import { ApiProperty } from '@nestjs/swagger';

export class FaqResponseDto {
  @ApiProperty({
    description: 'FAQ ID',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Question',
    example: 'What is this app?',
  })
  question: string;

  @ApiProperty({
    description: 'Answer',
    example: 'This is a great app that helps you...',
  })
  answer: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Whether this FAQ is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Created at',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
