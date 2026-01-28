import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'Ahmad Ali',
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  name: string;

  @ApiProperty({
    description: 'Customer description or notes',
    example: 'Regular client',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+989123456789',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  phoneNumber?: string;
}
