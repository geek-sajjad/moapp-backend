import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpDto {
  @ApiProperty({ description: 'The identifier for the OTP' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'The OTP code' })
  @IsString()
  otp: string;

  constructor(identifier: string, otp: string) {
    this.identifier = identifier;
    this.otp = otp;
  }
}
