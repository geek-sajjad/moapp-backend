import { ApiProperty } from '@nestjs/swagger';

export class S3UploadResponseDto {
  @ApiProperty({
    description: 'The key of the uploaded file in the S3 bucket',
    type: String,
  })
  key: string;

  @ApiProperty({
    description: 'TheS3 bucket',
    type: String,
  })
  bucket: string;

  @ApiProperty({
    description: 'The path to the uploaded file in the S3 bucket',
    type: String,
  })
  path: string;

  constructor(key: string, bucket: string, path: string) {
    this.key = key;
    this.bucket = bucket;
    this.path = path;
  }
}
