import { BadRequestException } from '@nestjs/common';

export class DuplicateSlugException extends BadRequestException {
  constructor(slug: string) {
    super(
      `A page with slug "${slug}" already exists. Please use a different slug.`,
    );
  }
}
