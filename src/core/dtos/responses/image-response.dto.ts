import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ImageResponseDto {
  @AutoMap()
  @ApiProperty({
    description: 'The URL of the image',
    type: String,
    example: 'https://bucket.s3.region.amazonaws.com/path/to/image.webp',
  })
  url: string;

  @AutoMap()
  @ApiProperty({
    description: 'Alternative text for the image',
    type: String,
    example: 'A delicious meal image',
    maxLength: 100,
    required: false,
  })
  altText?: string;
}
