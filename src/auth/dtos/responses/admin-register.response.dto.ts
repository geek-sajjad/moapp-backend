import { ApiProperty } from '@nestjs/swagger';

export class AdminRegisterResponseDto {
  @ApiProperty({
    example: 'janedoe',
    description: 'The full name of the admin user',
  })
  fullName?: string;

  @ApiProperty({
    example: 'jane@example.com',
    description: 'The email of the admin user',
  })
  email: string;

  @ApiProperty({
    example: 'jane@example.com',
    description: 'The email of the admin user',
  })
  userId: string;

  constructor(
    fullName: string,

    email: string,
    userId: string,
  ) {
    this.fullName = fullName;
    this.email = email;
    this.userId = userId;
  }
}
