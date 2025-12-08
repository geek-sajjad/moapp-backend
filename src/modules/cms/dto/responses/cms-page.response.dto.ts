import { ApiProperty } from '@nestjs/swagger';

export class CmsPageResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the page',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the page',
    example: 'About Us',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the page in HTML or markdown format',
    example: '# About Us\n\nWelcome to our platform...',
  })
  content: string;

  @ApiProperty({
    description: 'The unique slug for the page',
    example: 'about-us',
  })
  slug: string;

  @ApiProperty({
    description: 'Whether the page is active',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Additional metadata for the page',
    example: {
      seo: {
        title: 'About Us - Our Company',
        description: 'Learn more about our company',
      },
    },
  })
  metadata: Record<string, unknown>;

  @ApiProperty({
    description: 'The creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update timestamp',
  })
  updatedAt: Date;
}
