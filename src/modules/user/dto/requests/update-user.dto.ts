import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

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
    description: 'Full name',
    example: 'John Doe',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+989123456789',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  phoneNumber?: string;

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
