import { ApiProperty } from '@nestjs/swagger';

export class OtpGenerationResponseDto {
  @ApiProperty({ description: 'The identifier' })
  identifier: string;

  @ApiProperty({ description: 'The OTP code' })
  otp: string;

  constructor(identifier: string, otp?: string) {
    this.identifier = identifier;
    this.otp = otp;
  }
}
