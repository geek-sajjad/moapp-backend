import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+96612345678',
    description: 'The phone of the user',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: '1234',
    description: 'The otp code for user',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
