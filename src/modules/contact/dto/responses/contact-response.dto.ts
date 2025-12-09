import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class ContactResponseDto {
  @AutoMap()
  @ApiProperty({
    description: 'Contact ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    description: 'Contact name',
    example: 'Ahmad Rezaei',
  })
  name: string;

  @AutoMap()
  @ApiProperty({
    description: 'Contact phone number',
    example: '+989121234567',
    nullable: true,
  })
  phoneNumber?: string;

  @AutoMap()
  @ApiProperty({
    description: 'User ID who owns this contact',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

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
