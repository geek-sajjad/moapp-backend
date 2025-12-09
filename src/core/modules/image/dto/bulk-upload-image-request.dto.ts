import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { ImageSize } from '../constant/image.constant';

export class BulkUploadImageRequestDto {
  @ApiProperty({
    description: 'The size variant to generate for all images',
    enum: ImageSize,
    required: false,
    default: ImageSize.MEDIUM,
  })
  @IsOptional()
  @IsEnum(ImageSize)
  size?: ImageSize = ImageSize.MEDIUM;
}
