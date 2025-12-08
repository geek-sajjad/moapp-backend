import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationService {
  private static readonly MAX_FILE_SIZE_MB = 5;

  private static readonly MAX_IMAGE_SIZE_MB = 1;

  private static readonly ALLOWED_MIME_TYPES = [
    // Images
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    // Videos
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/3gpp',
    'video/quicktime',
    'video/x-msvideo',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    // Archives
    'application/zip',
    'application/x-7z-compressed',
    'application/x-rar-compressed',
  ];

  validateMimeType(mimeType: string): void {
    if (!FileValidationService.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        `Unsupported file type: ${mimeType}. Allowed types are: ${FileValidationService.ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
  }

  validateFileSize(fileSize: number): void {
    const maxFileSizeBytes =
      FileValidationService.MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes
    if (fileSize > maxFileSizeBytes) {
      throw new BadRequestException(
        `File size exceeds the limit of ${FileValidationService.MAX_FILE_SIZE_MB}MB.`,
      );
    }
  }

  validateImageSize(fileSize: number): void {
    const maxFileSizeBytes =
      FileValidationService.MAX_IMAGE_SIZE_MB * 1024 * 1024; // Convert MB to bytes
    if (fileSize > maxFileSizeBytes) {
      throw new BadRequestException(
        `Image size exceeds the limit of ${FileValidationService.MAX_IMAGE_SIZE_MB}MB.`,
      );
    }
  }
}
