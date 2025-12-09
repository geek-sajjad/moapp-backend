import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Phone number',
    example: '+989123456789',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'New password',
    example: 'NewStrongPass123!',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'OTP code received via SMS',
    example: '1234',
  })
  otp: string;
}
