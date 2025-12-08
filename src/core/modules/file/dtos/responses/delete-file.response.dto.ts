import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileResponseDto {
  @ApiProperty({
    description: 'Message indicating the result of the delete operation',
    example: 'File deleted successfully',
  })
  message: string;
}
