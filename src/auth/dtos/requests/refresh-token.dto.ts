import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'your-refresh-token-here',
    description: 'The refresh token used to obtain a new access token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
