import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'Ahmad Ali',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+989123456789',
    required: false,
  })
  @IsString({ message: 'validation.IS_STRING' })
  @IsOptional()
  phoneNumber?: string;
}
