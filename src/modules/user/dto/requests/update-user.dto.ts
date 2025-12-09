import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+989123456789',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'Password',
    example: 'StrongPass123!',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @MinLength(6, { message: 'validation.MIN_LENGTH' })
  @IsOptional()
  password?: string;
}
