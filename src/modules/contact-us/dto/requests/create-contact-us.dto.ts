import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';

export class CreateContactUsDto {
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @MaxLength(100, { message: 'validation.MAX_LENGTH' })
  @ApiProperty({
    description: 'The name of the person sending the message',
    example: 'John Doe',
  })
  name: string;

  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  @ApiProperty({
    description: 'The email address of the person sending the message',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @MaxLength(200, { message: 'validation.MAX_LENGTH' })
  @ApiProperty({
    description: 'The subject of the contact message',
    example: 'General Inquiry',
  })
  subject: string;

  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @ApiProperty({
    description: 'The message content',
    example: 'I would like to know more about your services.',
  })
  message: string;
}
