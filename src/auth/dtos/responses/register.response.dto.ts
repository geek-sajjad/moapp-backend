import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/core/enums';

export class RegisterResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The access token for the user',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9-refresh...',
    description: 'The refresh token for the user',
  })
  refreshToken: string;

  @ApiProperty({
    example: 'uuid-here',
    description: 'The user ID',
  })
  userId: string;

  @ApiProperty({
    example: 'janedoe',
    description: 'The username',
  })
  username: string;

  @ApiProperty({
    example: 'Jane Doe',
    description: 'The full name',
  })
  fullName: string;

  @ApiProperty({
    example: 'jane@example.com',
    description: 'The email',
  })
  email: string;

  @ApiProperty({
    example: RoleEnum.USER,
    description: 'The user role',
    enum: RoleEnum,
  })
  role: RoleEnum;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}

