import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminRegisterDto {
  @ApiProperty({
    example: 'janedoe',
    description: 'The full name  of the admin user',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    example: 'jane@example.com',
    description: 'The email of the admin user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1234',
    description: 'The password of the new user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
