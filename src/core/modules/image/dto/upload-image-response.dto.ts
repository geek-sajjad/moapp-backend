import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({
    description: 'The uploaded image URL',
    type: String,
    example: 'https://bucket.s3.region.amazonaws.com/path/to/image.webp',
  })
  url: string;

  @ApiProperty({
    description: 'Temporary ID for the uploaded image',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tempId: string;
}
