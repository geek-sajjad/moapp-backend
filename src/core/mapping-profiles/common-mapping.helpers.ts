import { ImageDto } from '../dtos/requests/image.dto';
import { ImageResponseDto } from '../dtos/responses';
import { ConfigService } from '@nestjs/config';

export class CommonMappingHelpers {
  private static configService: ConfigService;

  /**
   * Initialize the config service
   * @param configService - NestJS ConfigService instance
   */
  static initialize(configService: ConfigService): void {
    this.configService = configService;
  }

  /**
   * Maps profile image with default fallback
   * @param src - Source object with optional image property
   * @param defaultAltText - Custom alt text for default image
   * @returns ImageResponseDto with default profile image if image is null/undefined
   */
  static mapProfileImageWithDefault(
    src: { image?: ImageDto },
    defaultAltText = 'Default profile image',
  ): ImageResponseDto {
    return (
      src.image || {
        url:
          this.configService?.get<string>('DEFAULT_PROFILE_IMAGE') ||
          'https://fra1.digitaloceanspaces.com/development-wjbt/wjbti-backend/images/small-1757589202485_dd123d9f-f530-489a-8fa3-234dacced7d7.webp',
        altText: defaultAltText,
      }
    );
  }

  /**
   * Maps meal image with default fallback
   * @param src - Source object with optional image property
   * @param defaultAltText - Custom alt text for default image
   * @returns ImageResponseDto with default meal image if image is null/undefined
   */
  static mapMealImageWithDefault(
    src: { image?: ImageDto },
    defaultAltText = 'Default meal image',
  ): ImageResponseDto {
    return (
      src.image || {
        url:
          this.configService?.get<string>('DEFAULT_MEAL_IMAGE') ||
          'https://fra1.digitaloceanspaces.com/development-wjbt/wjbti-backend/images/small-1757589202485_dd123d9f-f530-489a-8fa3-234dacced7d7.webp',
        altText: defaultAltText,
      }
    );
  }

  /**
   * Maps plan image with default fallback
   * @param src - Source object with optional image property
   * @param defaultAltText - Custom alt text for default image
   * @returns ImageResponseDto with default plan image if image is null/undefined
   */
  static mapPlanImageWithDefault(
    src: { image?: ImageDto },
    defaultAltText = 'Default plan image',
  ): ImageResponseDto {
    return (
      src.image || {
        url:
          this.configService?.get<string>('DEFAULT_PLAN_IMAGE') ||
          'https://fra1.digitaloceanspaces.com/development-wjbt/wjbti-backend/images/small-1757589202485_dd123d9f-f530-489a-8fa3-234dacced7d7.webp',
        altText: defaultAltText,
      }
    );
  }

  /**
   * Maps generic image with default fallback
   * @param src - Source object with optional image property
   * @param defaultAltText - Custom alt text for default image
   * @returns ImageResponseDto with default image if image is null/undefined
   */
  static mapImageWithDefault(
    src: { image?: ImageDto },
    defaultAltText = 'Default image',
  ): ImageResponseDto {
    return (
      src.image || {
        url:
          this.configService?.get<string>('DEFAULT_IMAGE') ||
          'https://fra1.digitaloceanspaces.com/development-wjbt/wjbti-backend/images/small-1757589202485_dd123d9f-f530-489a-8fa3-234dacced7d7.webp',
        altText: defaultAltText,
      }
    );
  }
}
