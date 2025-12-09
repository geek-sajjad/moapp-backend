import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if password was reset successfully',
  })
  success: boolean;

  @ApiProperty({
    example: 'Password reset successfully',
    description: 'Success message',
  })
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}

