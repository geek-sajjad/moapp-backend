import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RespondContactDto {
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @ApiProperty({
    description: 'The admin response to the contact message',
    example: 'Thank you for your inquiry. Here is our response...',
  })
  message: string;
}
