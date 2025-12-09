import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Contact name',
    example: 'Ahmad Rezaei',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  name: string;

  @ApiProperty({
    description: 'Contact phone number (optional)',
    example: '+989121234567',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  phoneNumber?: string;
}
