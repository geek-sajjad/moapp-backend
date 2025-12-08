import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmsMessageDto {
  @ApiProperty({
    description: 'The phone number to which the message will be sent',
    example: '+1234567890',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsPhoneNumber(null, { message: 'validation.INVALID_PHONE_NUMBER' })
  to: string;

  @ApiProperty({
    description: 'The content of the SMS message',
    example: 'Hello, this is a test message!',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  message: string;
}
