import { BadRequestException } from '@nestjs/common';

export class DuplicateTitleException extends BadRequestException {
  constructor(title: string) {
    super(
      `A page with title "${title}" already exists. Please use a different title.`,
    );
  }
}
