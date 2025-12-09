import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User phone number',
    example: '+989123456789',
  })
  phoneNumber: string;
}
