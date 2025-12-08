import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResponseDto {
  @ApiProperty({
    example: '+989159109100',
    description: 'The phone of the user',
  })
  phoneNumber: string;

  @ApiProperty({
    example: false,
    description: 'New user or not',
  })
  isNewUser: boolean = false;

  @ApiProperty({
    example: false,
    description: 'user Id',
  })
  userId?: string;

  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Temp OTP token for Signup',
  })
  tempOtpToken?: string;

  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token for authentication',
  })
  accessToken?: string;

  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token for obtaining a new access token',
  })
  refreshToken?: string;

  constructor(dto: {
    phoneNumber: string;
    isNewUser: boolean;
    tempOtpToken?: string;
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
  }) {
    this.isNewUser = dto.isNewUser;
    this.phoneNumber = dto.phoneNumber;
    this.tempOtpToken = dto.tempOtpToken;
    this.accessToken = dto.accessToken;
    this.refreshToken = dto.refreshToken;
    this.userId = dto.userId;
  }
}
