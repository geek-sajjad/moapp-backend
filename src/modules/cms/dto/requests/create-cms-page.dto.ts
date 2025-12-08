import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsObject,
  MaxLength,
} from 'class-validator';

export class CreateCmsPageDto {
  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @MaxLength(200, { message: 'validation.MAX_LENGTH' })
  @ApiProperty({
    description: 'The title of the page',
    example: 'About Us',
  })
  title: string;

  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @ApiProperty({
    description: 'The content of the page in HTML or markdown format',
    example: '# About Us\n\nWelcome to our platform...',
  })
  content: string;

  @IsString({ message: 'validation.IS_STRING' })
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @ApiProperty({
    description: 'The unique slug for the page',
    example: 'about-us',
  })
  slug: string;

  @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })
  @IsOptional()
  @ApiProperty({
    description: 'Whether the page is active',
    default: true,
  })
  isActive?: boolean;

  @IsObject({ message: 'validation.IS_OBJECT' })
  @IsOptional()
  @ApiProperty({
    description: 'Additional metadata for the page',
    example: {
      seo: {
        title: 'About Us - Our Company',
        description: 'Learn more about our company',
      },
    },
  })
  metadata?: Record<string, unknown>;
}
