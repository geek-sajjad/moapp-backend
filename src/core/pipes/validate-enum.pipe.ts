import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateEnumPipe implements PipeTransform<string> {
  constructor(private readonly enumType: Record<string, string | number>) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    // Get all enum values (we need the string values, not the enum keys)
    const enumValues = Object.values(this.enumType).filter(
      (item) => typeof item === 'string',
    );

    // Check if value exists in the enum values
    if (!enumValues.includes(value)) {
      const paramName = metadata.data || 'parameter';
      const errorMessage = `Invalid ${paramName}. Valid values are: ${enumValues.join(', ')}`;

      throw new BadRequestException(errorMessage);
    }

    return value;
  }
}
