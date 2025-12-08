import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class ParseUUIDArrayPipe implements PipeTransform<string | string[]> {
  constructor(private readonly i18n: I18nService) {}

  async transform(
    value: string | string[],
    metadata: ArgumentMetadata,
  ): Promise<string[]> {
    if (!value) {
      return [];
    }

    // Convert to array if it's a string
    const valueArray = Array.isArray(value) ? value : value.split(',');

    // Check if all values are valid UUIDs
    const invalidIndices = [];
    valueArray.forEach((id, index) => {
      if (!validateUUID(id.trim())) {
        invalidIndices.push(index + 1);
      }
    });

    if (invalidIndices.length > 0) {
      const errorKey = 'validation.INVALID_UUID_ARRAY';
      const paramName = metadata.data || 'parameter';
      const positions = invalidIndices.join(', ');
      const translatedError = await this.i18n.translate(errorKey, {
        args: { property: paramName, positions },
      });

      throw new BadRequestException(translatedError);
    }

    return valueArray.map((id) => id.trim());
  }
}
