import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupResponseDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'a sample name',
    type: String,
  })
  fullName?: string;

  @ApiProperty({
    description: 'phoneNumber',
    type: String,
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'userId',
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: 'Access token for authentication',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for obtaining a new access token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  refreshToken: string;

  constructor(dto: {
    fullName: string;
    email: string;
    phoneNumber: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
  }) {
    this.fullName = dto.fullName;
    this.phoneNumber = dto.phoneNumber;
    this.userId = dto.userId;
    this.accessToken = dto.accessToken;
    this.refreshToken = dto.refreshToken;
  }
}
