import { ApiProperty } from '@nestjs/swagger';
import { UploadImageResponseDto } from './upload-image-response.dto';

export class BulkUploadImageResponseDto {
  @ApiProperty({
    description: 'Array of successfully uploaded images',
    type: [UploadImageResponseDto],
  })
  images: UploadImageResponseDto[];

  @ApiProperty({
    description: 'Total number of images uploaded successfully',
    type: Number,
  })
  totalUploaded: number;

  @ApiProperty({
    description: 'Number of failed uploads',
    type: Number,
  })
  failedUploads: number;
}
