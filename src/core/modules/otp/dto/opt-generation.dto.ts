import { ApiProperty } from '@nestjs/swagger';

export class OtpGenerationDto {
  @ApiProperty({ description: 'The identifier - can be email or phone number' })
  identifier: string;
}
