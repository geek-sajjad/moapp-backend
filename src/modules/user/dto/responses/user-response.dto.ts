import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class UserResponseDto {
  @AutoMap()
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @AutoMap()
  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  fullName: string;

  @AutoMap()
  @ApiProperty({
    description: 'Phone number',
    example: '+989123456789',
  })
  phoneNumber: string;

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
