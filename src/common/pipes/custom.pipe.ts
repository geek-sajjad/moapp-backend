/* eslint-disable max-classes-per-file */
import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      transform: true, // Enable transformation
      exceptionFactory: (errors) => this.createI18nValidationErrors(errors),
    });
  }

  private async createI18nValidationErrors(errors: ValidationError[]) {
    const messages = await Promise.all(
      errors.map(async (error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : '';
        const translatedMessage = await this.i18n.translate(constraints, {
          args: { property: error.property },
        });
        return `${error.property} - ${translatedMessage}`;
      }),
    );
    return new BadRequestException(messages);
  }
}
