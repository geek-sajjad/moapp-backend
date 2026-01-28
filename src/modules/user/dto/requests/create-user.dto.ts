import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  username: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  fullName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+989123456789',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Password',
    example: 'StrongPass123!',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @MinLength(6, { message: 'validation.MIN_LENGTH' })
  password: string;
}
