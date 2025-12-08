import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateFaqDto {
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @MaxLength(500, { message: 'validation.MAX_LENGTH' })
  @ApiProperty({
    description: 'The question for the FAQ',
    example: 'How do I reset my password?',
  })
  question: string;

  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @ApiProperty({
    description: 'The answer to the FAQ question',
    example:
      'You can reset your password by clicking on the "Forgot Password" link on the login page...',
  })
  answer: string;

  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @Min(0, { message: 'validation.MIN_0' })
  @ApiProperty({
    description: 'The order in which the FAQ should appear (0 being first)',
    example: 1,
  })
  order: number;

  @IsBoolean({ message: 'validation.IS_BOOLEAN' })
  @ApiProperty({
    description: 'Whether the FAQ is active and should be displayed',
    example: true,
    default: true,
  })
  isActive: boolean = true;
}
