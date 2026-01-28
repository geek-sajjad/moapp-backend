/* eslint-disable max-classes-per-file */
import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true, // Enable transformation
      exceptionFactory: (errors) => this.createValidationErrors(errors),
    });
  }

  private createValidationErrors(errors: ValidationError[]) {
    const messages = errors.map((error) => {
      const constraints = error.constraints
        ? Object.values(error.constraints).join(', ')
        : '';
      return `${error.property} - ${constraints}`;
    });
    return new BadRequestException(messages);
  }
}
