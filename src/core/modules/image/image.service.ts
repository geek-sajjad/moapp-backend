/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Injectable, Optional, BadRequestException } from '@nestjs/common';
import * as Sharp from 'sharp';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { ImageInput } from './interfaces';
import { S3Service } from '../s3/s3.service';
import { ImageSize, ImageWidths } from './constant/image.constant';
import { UploadImageResponseDto } from './dto';

@Injectable()
export class ImageService {
  private readonly filePath: string;

  private readonly maxFileSize: number;

  private readonly outputDir = '/tmp/uploads';

  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
  ];

  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    @Optional() filePath?: string,
    @Optional() maxFileSize?: number,
  ) {
    this.filePath =
      filePath ?? this.configService.get<string>('FILE_PATH', 'images'); // Default: 'images'
    this.maxFileSize =
      maxFileSize ?? this.configService.get<number>('MAX_FILE_SIZE', 3); // Default: 3 MB
  }

  /**
   * Gets the hardcoded app name for S3 keys
   * @returns Hardcoded app name safe for S3 keys
   */
  private getAppName(): string {
    return 'wjbti-backend';
  }

  /**
   * Validates if the file is a valid image
   * @param file - The file to validate
   * @throws BadRequestException if file is invalid
   */
  private validateImageFile(file: ImageInput, mimeType?: string): void {
    if (!file || !file.buffer) {
      throw new BadRequestException('message.IMAGE.INVALID_FILE_TYPE');
    }

    if (file.buffer.length === 0) {
      throw new BadRequestException('message.IMAGE.INVALID_FILE_TYPE');
    }

    if (file.buffer.length > this.maxFileSize * 1024 * 1024) {
      throw new BadRequestException('message.IMAGE.FILE_TOO_LARGE');
    }

    // If mimeType is provided, validate it
    if (mimeType && !this.allowedMimeTypes.includes(mimeType.toLowerCase())) {
      throw new BadRequestException('message.IMAGE.INVALID_FILE_TYPE');
    }
  }

  /**
   * Validates if the file is a valid image using Sharp
   * @param buffer - The file buffer
   * @throws BadRequestException if file is not a valid image
   */
  private async validateImageWithSharp(buffer: Buffer): Promise<void> {
    try {
      const metadata = await Sharp(buffer).metadata();
      if (!metadata.width || !metadata.height) {
        throw new BadRequestException('message.IMAGE.INVALID_FILE_TYPE');
      }
    } catch {
      throw new BadRequestException('message.IMAGE.INVALID_FILE_TYPE');
    }
  }

  /**
   * Generates a time-based random filename while preserving the original extension
   * @param originalName - The original filename
   * @returns A new filename with timestamp and UUID
   */
  private generateRandomFileName(originalName: string): string {
    const timestamp = Date.now();
    const uuid = uuidv4();
    const extension = path.extname(originalName);
    return `${timestamp}_${uuid}${extension}`;
  }

  async uploadImage(
    file: ImageInput,
    mimeType?: string,
  ): Promise<UploadImageResponseDto[]> {
    this.validateImageFile(file, mimeType);
    await this.validateImageWithSharp(file.buffer);

    const imagesList = await this.processAndResizeImageInAllSizes(file);

    const uploadPromises = imagesList.map((localPath) => {
      const appName = this.getAppName();
      const key = `${appName}/${this.filePath}/${path.basename(localPath)}`;
      return this.s3Service.uploadByPath({
        localPath,
        key,
      });
    });

    // Execute all uploads concurrently
    const uploadedImagesInS3Urls = await Promise.all(uploadPromises);
    fsExtra.emptyDir(this.outputDir);

    // Return simplified response with URL and temp ID
    return uploadedImagesInS3Urls.map((s3Response) => ({
      url: s3Response.path,
      tempId: uuidv4(),
    }));
  }

  /**
   * Uploads a single image with specific size
   * @param file - The image file to upload
   * @param size - The image size to generate
   * @param mimeType - Optional MIME type for validation
   * @returns The uploaded image URL
   */
  async uploadSingleImage(
    file: ImageInput,
    mimeType?: string,
    size: ImageSize = ImageSize.MEDIUM,
  ): Promise<UploadImageResponseDto> {
    this.validateImageFile(file, mimeType);
    await this.validateImageWithSharp(file.buffer);

    const resizedImagePath = await this.processAndResizeImage(file, size);

    const appName = this.getAppName();
    const key = `${appName}/${this.filePath}/${path.basename(resizedImagePath)}`;
    const result = await this.s3Service.uploadByPath({
      localPath: resizedImagePath,
      key,
    });

    fsExtra.emptyDir(this.outputDir);

    // Return simplified response with URL and temp ID
    return {
      url: result.path,
      tempId: uuidv4(),
    };
  }

  /**
   * Uploads multiple images with error handling for each
   * @param files - Array of image files
   * @param size - The image size to generate for all images
   * @returns Array of upload results with success status
   */
  async uploadBulkImages(
    files: Express.Multer.File[],
    size: ImageSize = ImageSize.MEDIUM,
  ): Promise<
    Array<{ success: boolean; data?: UploadImageResponseDto; error?: string }>
  > {
    const results = [];

    for (const file of files) {
      try {
        const imageInput: ImageInput = {
          buffer: file.buffer,
          originalName: file.originalname,
        };

        this.validateImageFile(imageInput, file.mimetype);
        await this.validateImageWithSharp(file.buffer);

        const resizedImagePath = await this.processAndResizeImage(
          imageInput,
          size,
        );
        const appName = this.getAppName();
        const key = `${appName}/${this.filePath}/${path.basename(resizedImagePath)}`;

        const result = await this.s3Service.uploadByPath({
          localPath: resizedImagePath,
          key,
        });

        results.push({
          success: true,
          data: {
            url: result.path,
            tempId: uuidv4(),
          },
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Clean up any remaining files
    fsExtra.emptyDir(this.outputDir);
    return results;
  }

  manageImageFile(
    file: ImageInput,
    storeOriginalFile: boolean = false,
  ): { filePath: string; generatedFileName: string } {
    this.validateImageFile(file);

    const generatedFileName = this.generateRandomFileName(file.originalName);
    const filePath = path.join(this.outputDir, generatedFileName);
    if (storeOriginalFile) {
      fs.writeFileSync(filePath, file.buffer);
    }
    return { filePath, generatedFileName };
  }

  manageImageFolder() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async processAndResizeImageInAllSizes(file: ImageInput): Promise<string[]> {
    this.manageImageFolder();

    const { generatedFileName } = this.manageImageFile(file, false);

    // Convert original file to WebP as well
    const originalWebPPath = await this.resizeImage(
      file.buffer,
      ImageWidths[ImageSize.ORIGINAL],
      `original-${generatedFileName}`,
      this.outputDir,
    );

    const resizedFilePromises = Object.values(ImageSize).map((size) =>
      this.resizeImage(
        file.buffer,
        ImageWidths[size],
        `${size}-${generatedFileName}`,
        this.outputDir,
      ),
    );

    const resizedFiles = await Promise.all(resizedFilePromises);
    resizedFiles.push(originalWebPPath);

    return resizedFiles; // Return the processed file paths
  }

  async processAndResizeImage(
    file: ImageInput,
    size: ImageSize,
  ): Promise<string> {
    this.manageImageFolder();

    const generatedFileName = this.generateRandomFileName(file.originalName);
    const resizedImage = await this.resizeImage(
      file.buffer,
      ImageWidths[size],
      `${size}-${generatedFileName}`,
      this.outputDir,
    );

    return resizedImage;
  }

  private async resizeImage(
    buffer: Buffer,
    width: number,
    outputName: string,
    outputDir: string,
  ): Promise<string> {
    const outputPath = path.join(
      outputDir,
      outputName.replace(/\.[^/.]+$/, '.webp'),
    );

    // For original size, maintain aspect ratio and only resize if larger than max width
    const sharpInstance = Sharp(buffer);
    const metadata = await sharpInstance.metadata();

    if (
      width === ImageWidths[ImageSize.ORIGINAL] &&
      metadata.width &&
      metadata.width <= width
    ) {
      // Keep original dimensions for original size if within limits
      await sharpInstance.webp({ quality: 80 }).toFile(outputPath);
    } else {
      // Resize to specified width for other sizes
      await sharpInstance
        .resize({ width })
        .webp({ quality: 80 })
        .toFile(outputPath);
    }

    return outputPath;
  }

  /**
   * Uploads a profile image with specific sizing and path structure
   * @param file - The image file to upload
   * @param userId - The user ID for the profile image path
   * @param size - The image size to generate (defaults to SMALL)
   * @param mimeType - Optional MIME type for validation
   * @returns The uploaded image URL
   */
  async uploadProfileImage(
    file: ImageInput,
    userId: string,
    mimeType?: string,
    size: ImageSize = ImageSize.SMALL,
  ): Promise<string> {
    this.validateImageFile(file, mimeType);
    await this.validateImageWithSharp(file.buffer);

    // Process and resize the image
    const resizedImagePath = await this.processAndResizeImage(file, size);

    // Generate the S3 key for profile images
    const generatedFileName = path.basename(resizedImagePath);
    const appName = this.getAppName();
    const key = `${appName}/users/${userId}/profile/${generatedFileName}`;

    // Upload to S3
    const imageInfo = await this.s3Service.uploadByPath({
      localPath: resizedImagePath,
      key,
    });

    // Clean up local files
    fsExtra.emptyDir(this.outputDir);

    return imageInfo.path;
  }
}
