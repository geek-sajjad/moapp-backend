import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class ImageDto {
  @ApiProperty({
    description: 'The URL of the image',
    type: String,
    example: 'https://bucket.s3.region.amazonaws.com/path/to/image.webp',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Alternative text for the image',
    type: String,
    example: 'A delicious meal image',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  altText?: string = 'Image';
}
