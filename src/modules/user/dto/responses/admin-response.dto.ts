import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class AdminResponseDto {
  @ApiProperty({
    description: 'Admin ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @AutoMap()
  id: string;

  @ApiProperty({
    description: 'Admin username',
    example: 'admin',
  })
  @AutoMap()
  username: string;

  @ApiProperty({
    description: 'Admin full name',
    example: 'John Doe',
  })
  @AutoMap()
  fullName: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
  })
  @AutoMap()
  email: string;

  @ApiProperty({
    description: 'Is admin active',
    example: true,
  })
  @AutoMap()
  isActive: boolean;

  @ApiProperty({
    description: 'Admin creation timestamp',
    example: '2026-01-01T00:00:00.000Z',
  })
  @AutoMap()
  createdAt: Date;

  @ApiProperty({
    description: 'Admin last update timestamp',
    example: '2026-01-28T10:00:00.000Z',
  })
  @AutoMap()
  updatedAt: Date;
}
