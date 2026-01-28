import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
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

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
