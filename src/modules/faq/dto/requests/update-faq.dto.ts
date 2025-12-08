import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';
import { CreateFaqDto } from './create-faq.dto';

export class UpdateFaqDto implements Partial<CreateFaqDto> {
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsOptional()
  @MaxLength(500, { message: 'validation.MAX_LENGTH' })
  @ApiProperty({
    description: 'The question for the FAQ',
    example: 'How do I reset my password?',
  })
  question?: string;

  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsOptional()
  @ApiProperty({
    description: 'The answer to the FAQ question',
    example:
      'You can reset your password by clicking on the "Forgot Password" link on the login page...',
  })
  answer?: string;

  @IsNumber({}, { message: 'validation.MUST_BE_NUMBER' })
  @Min(0, { message: 'validation.MIN_0' })
  @IsOptional()
  @ApiProperty({
    description: 'The order in which the FAQ should appear (0 being first)',
    example: 1,
  })
  order?: number;

  @IsBoolean({ message: 'validation.IS_BOOLEAN' })
  @IsOptional()
  @ApiProperty({
    description: 'Whether the FAQ is active and should be displayed',
    example: true,
  })
  isActive?: boolean;
}
