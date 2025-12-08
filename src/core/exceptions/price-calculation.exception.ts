import { HttpException, HttpStatus } from '@nestjs/common';

export class PriceCalculationException extends HttpException {
  constructor(
    public readonly message: string,
    public readonly field?: string,
    public readonly developerMessage?: string,
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
