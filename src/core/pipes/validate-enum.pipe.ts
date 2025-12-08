import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ValidateEnumPipe implements PipeTransform<string> {
  constructor(
    private readonly i18n: I18nService,
    private readonly enumType: Record<string, string | number>,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    // Get all enum values (we need the string values, not the enum keys)
    const enumValues = Object.values(this.enumType).filter(
      (item) => typeof item === 'string',
    );

    // Check if value exists in the enum values
    if (!enumValues.includes(value)) {
      const errorKey = 'validation.INVALID_ENUM';
      const paramName = metadata.data || 'parameter';
      const translatedError = await this.i18n.translate(errorKey, {
        args: {
          property: paramName,
          validValues: enumValues.join(', '),
        },
      });

      throw new BadRequestException(translatedError);
    }

    return value;
  }
}
