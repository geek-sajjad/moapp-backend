import { ApiProperty } from '@nestjs/swagger';

export class OtpResponseDto {
  @ApiProperty({ description: 'The identifier' })
  identifier: string;

  @ApiProperty({ description: 'The OTP code' })
  otp: string;

  @ApiProperty({ description: 'The status of the OTP' })
  verified: boolean;

  @ApiProperty({ description: 'The message of the OTP validation' })
  message?: string;

  constructor(
    identifier: string,
    status: boolean,
    message?: string,
    otp?: string,
  ) {
    this.identifier = identifier;
    this.verified = status;
    this.otp = otp;
    this.message = message;
  }
}
