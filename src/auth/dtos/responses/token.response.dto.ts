import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/core/enums/role.enum';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The access token for the user',
  })
  accessToken: string;

  @ApiProperty({
    example: 'Admin',
    description: 'The role of the user',
    enum: RoleEnum,
    required: false,
  })
  role?: RoleEnum;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9-refresh...',
    description: 'The refresh token (optional)',
    required: false,
  })
  refreshToken?: string;

  constructor(accessToken: string, refreshToken?: string, role?: RoleEnum) {
    this.accessToken = accessToken;
    this.role = role;
    this.refreshToken = refreshToken;
  }
}
