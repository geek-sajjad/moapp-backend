/* eslint-disable import/no-extraneous-dependencies */
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as sharp from 'sharp';
import { FileRepository } from '../repositories';
import { FileEntity, FileType } from '../entities';
import { ImageSize, ImageWidths } from '../constant';
import { S3Service } from '../../s3/s3.service';
import { UploadFileResponseDto } from '../dtos/responses';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly s3Service: S3Service,
  ) {}

  async uploadFileS3(file: Express.Multer.File): Promise<FileEntity> {
    const fileKey = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = await this.s3Service.uploadByBuffer({
      key: fileKey,
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    const fileMetadata = {
      originalName: file.originalname,
      filePath: filePath.path,
      mimeType: file.mimetype,
      size: file.size,
      key: fileKey,
      extension: path.extname(file.originalname),
    };

    return this.fileRepository.createFile(fileMetadata);
  }

  async uploadFileS3ByType(
    file: Express.Multer.File,
    type: FileType,
  ): Promise<FileEntity> {
    const fileKey = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = await this.s3Service.uploadByBuffer({
      key: fileKey,
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    const fileMetadata = {
      originalName: file.originalname,
      filePath: filePath.path,
      mimeType: file.mimetype,
      size: file.size,
      key: fileKey,
      type,
      extension: path.extname(file.originalname),
    };

    return this.fileRepository.createFile(fileMetadata);
  }

  async uploadAndResizeImageS3(file: Express.Multer.File): Promise<FileEntity> {
    const originalExtension = path.extname(file.originalname);
    const baseKey = uuidv4();

    const originalKey = `${baseKey}${originalExtension}`;
    const originalFilePath = await this.s3Service.uploadByBuffer({
      key: originalKey,
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    const smallBuffer = await sharp(file.buffer)
      .resize({ width: ImageWidths[ImageSize.SMALL] })
      .webp({ quality: 80 })
      .toBuffer();
    const mediumBuffer = await sharp(file.buffer)
      .resize({ width: ImageWidths[ImageSize.MEDIUM] })
      .webp({ quality: 80 })
      .toBuffer();
    const largeBuffer = await sharp(file.buffer)
      .resize({ width: ImageWidths[ImageSize.LARGE] })
      .webp({ quality: 80 })
      .toBuffer();

    const smallKey = `${baseKey}_${ImageSize.SMALL}${originalExtension}`;
    const mediumKey = `${baseKey}_${ImageSize.MEDIUM}${originalExtension}`;
    const largeKey = `${baseKey}_${ImageSize.LARGE}${originalExtension}`;

    const filePathSmall = await this.s3Service.uploadByBuffer({
      key: smallKey,
      buffer: smallBuffer,
      contentType: file.mimetype,
    });
    const filePathMedium = await this.s3Service.uploadByBuffer({
      key: mediumKey,
      buffer: mediumBuffer,
      contentType: file.mimetype,
    });
    const filePathLarge = await this.s3Service.uploadByBuffer({
      key: largeKey,
      buffer: largeBuffer,
      contentType: file.mimetype,
    });

    const fileMetadata = {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      key: originalKey,
      extension: originalExtension,
      filePath: originalFilePath.path,
      filePathSmall: filePathSmall.path,
      filePathMedium: filePathMedium.path,
      filePathLarge: filePathLarge.path,
    };

    return this.fileRepository.createFile(fileMetadata);
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.fileRepository.findFileById(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    await this.fileRepository.deleteFile(fileId);
  }

  async findOne(id: string): Promise<FileEntity> {
    const file = await this.fileRepository.findFileById(id);
    if (!file) {
      throw new NotFoundException('message.FILE.NOT_FOUND');
    }
    return file;
  }

  public createFileResponseDto(file: FileEntity): UploadFileResponseDto {
    return new UploadFileResponseDto({
      id: file.id,
      originalName: file.originalName,
      filePath: file.filePath,
      filePathSmall: file.filePathSmall,
      filePathMedium: file.filePathMedium,
      filePathLarge: file.filePathLarge,
      mimeType: file.mimeType,
      size: file.size,
      key: file.key,
      extension: file.extension,
    });
  }

  async deleteById(id: string): Promise<void> {
    const file = await this.fileRepository.findFileById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Delete from S3 if needed
    // await this.s3Service.deleteFile(file.key);
    // if (file.filePathSmall) {
    //   await this.s3Service.deleteFile(
    //     file.key.replace(
    //       path.extname(file.key),
    //       `_${ImageSize.SMALL}${path.extname(file.key)}`,
    //     ),
    //   );
    // }
    // if (file.filePathMedium) {
    //   await this.s3Service.deleteFile(
    //     file.key.replace(
    //       path.extname(file.key),
    //       `_${ImageSize.MEDIUM}${path.extname(file.key)}`,
    //     ),
    //   );
    // }
    // if (file.filePathLarge) {
    //   await this.s3Service.deleteFile(
    //     file.key.replace(
    //       path.extname(file.key),
    //       `_${ImageSize.LARGE}${path.extname(file.key)}`,
    //     ),
    //   );
    // }

    // Delete from database
    await this.fileRepository.deleteFile(id);
  }

  async getFilesByType(type: FileType): Promise<FileEntity[]> {
    return this.fileRepository.findFilesByType(type);
  }
}
