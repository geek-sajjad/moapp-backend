import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { ImageSize } from '../constant/image.constant';

export class UploadImageRequestDto {
  @ApiProperty({
    description: 'The image file to upload',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'The size variant to generate for the image',
    enum: ImageSize,
    required: false,
    default: ImageSize.MEDIUM,
  })
  @IsOptional()
  @IsEnum(ImageSize)
  size?: ImageSize = ImageSize.MEDIUM;
}
