import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginResponseDto {
  // @ApiProperty({
  //   description: 'The first name of the user',
  //   example: 'a sample name',
  //   type: String,
  // })
  // firstName?: string;

  // @ApiProperty({
  //   description: 'The last name of the user',
  //   example: 'a sample name',
  //   type: String,
  // })
  // lastName?: string;

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

  @ApiProperty({
    description: 'User role',
    example: 'admin',
    type: String,
  })
  role: string;

  constructor(
    userId: string,
    // firstName: string,
    // lastName: string,
    accessToken: string,
    refreshToken: string,
    role: string,
  ) {
    // this.firstName = firstName;
    // this.lastName = lastName;
    this.userId = userId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.role = role;
  }
}
