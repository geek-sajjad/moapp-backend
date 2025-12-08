import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
  @ApiProperty({ description: 'The receiver of the email' })
  email: string;

  @ApiProperty({ description: 'The subject of the email' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.IS_STRING' })
  subject: string;

  @ApiProperty({ description: 'The text content of the email' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.IS_STRING' })
  text?: string;

  @ApiProperty({ description: 'The html content of the email' })
  @IsString({ message: 'validation.IS_STRING' })
  html?: string;
}
