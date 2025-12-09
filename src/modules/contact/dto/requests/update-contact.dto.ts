import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateContactDto {
  @ApiProperty({
    description: 'Contact name',
    example: 'Ahmad Rezaei',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+989121234567',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  phoneNumber?: string;
}
