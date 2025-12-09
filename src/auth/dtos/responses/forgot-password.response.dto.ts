import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'OTP sent to your phone number',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: '+989123456789',
    description: 'The phone number where OTP was sent',
  })
  phoneNumber: string;

  constructor(phoneNumber: string, message: string) {
    this.phoneNumber = phoneNumber;
    this.message = message;
  }
}

