import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  MaxLength,
} from 'class-validator';

export class UpdateCmsPageDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  @ApiProperty({
    description: 'The title of the page',
    example: 'About Us',
    required: false,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The content of the page in HTML or markdown format',
    example: '# About Us\n\nWelcome to our platform...',
    required: false,
  })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The unique slug for the page',
    example: 'about-us',
    required: false,
  })
  slug?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the page is active',
    default: true,
    required: false,
  })
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    description: 'Additional metadata for the page',
    example: {
      seo: {
        title: 'About Us - Our Company',
        description: 'Learn more about our company',
      },
    },
    required: false,
  })
  metadata?: Record<string, unknown>;
}
