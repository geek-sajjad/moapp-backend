import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class ParseUUIDCustomPipe implements PipeTransform<string> {
  constructor(private readonly i18n: I18nService) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    // Check if value is a valid UUID
    if (!validateUUID(value)) {
      const errorKey = 'validation.INVALID_UUID';
      const paramName = metadata.data || 'parameter';
      const translatedError = await this.i18n.translate(errorKey, {
        args: { property: paramName },
      });

      throw new BadRequestException(translatedError);
    }
    return value;
  }
}
