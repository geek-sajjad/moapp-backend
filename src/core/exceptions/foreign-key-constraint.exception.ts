import { HttpException, HttpStatus } from '@nestjs/common';

export class ForeignKeyConstraintException extends HttpException {
  constructor(
    public readonly message: string = 'message.ERRORS.FOREIGN_KEY_CONSTRAINT',
    public readonly developerMessage?: string,
  ) {
    super(message, HttpStatus.CONFLICT);
  }
}
