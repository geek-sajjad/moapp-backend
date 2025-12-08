import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the uploaded file',
    example: '607f1f77bcf86cd799439012',
  })
  id: string;

  @ApiProperty({
    description: 'URL to the uploaded file on S3',
    example: 'https://your-s3-endpoint/your-bucket/fileKey.jpg',
  })
  filePath: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'photo.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 102400,
  })
  size: number;

  @ApiProperty({
    description: 'S3 object key for the file',
    example: 'a1b2c3d4e5f6.jpg',
  })
  key: string;

  @ApiProperty({
    description: 'File extension',
    example: '.jpg',
  })
  extension: string;

  @ApiProperty({
    description: 'URL to the "small" resized image (if any)',
    required: false,
  })
  filePathSmall?: string;

  @ApiProperty({
    description: 'URL to the "medium" resized image (if any)',
    required: false,
  })
  filePathMedium?: string;

  @ApiProperty({
    description: 'URL to the "large" resized image (if any)',
    required: false,
  })
  filePathLarge?: string;

  constructor(partial: Partial<UploadFileResponseDto>) {
    Object.assign(this, partial);
  }
}
