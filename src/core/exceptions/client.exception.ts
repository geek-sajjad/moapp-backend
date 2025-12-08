import { HttpException } from '@nestjs/common';

export class ClientException extends HttpException {
  constructor(
    public readonly message: string,
    public readonly args?: Record<string, string | number>,
    public readonly developerMessage?: string,
  ) {
    super(message, 400);
  }
}
