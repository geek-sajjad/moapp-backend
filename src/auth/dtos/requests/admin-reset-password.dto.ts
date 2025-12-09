import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminResetPasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'New password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Confirm new password' })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Reset password token' })
  token: string;
}

