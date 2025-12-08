import { I18nService } from 'nestjs-i18n';
import { ParseUUIDCustomPipe } from '../pipes/parse-uuid.pipe';
import { ValidateEnumPipe } from '../pipes/validate-enum.pipe';
import { ParseUUIDArrayPipe } from '../pipes/parse-uuid-array.pipe';

/**
 * Factory function to create a ParseUUIDCustomPipe with i18n support
 * @param version UUID version (3, 4, or 5)
 * @returns A factory function that creates a ParseUUIDCustomPipe instance
 */
export function createParseUUIDPipe() {
  return {
    provide: ParseUUIDCustomPipe,
    useFactory: (i18n: I18nService) => new ParseUUIDCustomPipe(i18n),
    inject: [I18nService],
  };
}

/**
 * Factory function to create a ValidateEnumPipe with i18n support
 * @param enumType The enum type to validate against
 * @returns A factory function that creates a ValidateEnumPipe instance
 */
export function createValidateEnumPipe(
  enumType: Record<string, string | number>,
) {
  return {
    provide: `ENUM_VALIDATOR_${Object.keys(enumType)[0]}`,
    useFactory: (i18n: I18nService) => new ValidateEnumPipe(i18n, enumType),
    inject: [I18nService],
  };
}

/**
 * Factory function to create a ParseUUIDArrayPipe with i18n support
 * @returns A factory function that creates a ParseUUIDArrayPipe instance
 */
export function createParseUUIDArrayPipe() {
  return {
    provide: ParseUUIDArrayPipe,
    useFactory: (i18n: I18nService) => new ParseUUIDArrayPipe(i18n),
    inject: [I18nService],
  };
}
