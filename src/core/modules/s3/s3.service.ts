/* eslint-disable no-param-reassign */
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime-types';
import {
  S3UploadBufferDto,
  S3UploadFilePathDto,
  S3UploadResponseDto,
} from './dto';

@Injectable()
export class S3Service {
  static s3: S3Client;

  private endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get('DIGITAL_OCEAN_ENDPOINT');
  }

  async uploadByPath(
    params: S3UploadFilePathDto,
  ): Promise<S3UploadResponseDto> {
    try {
      const { localPath, key, bucketName } = params;

      const body = fs.createReadStream(localPath);
      const contentType = params.contentType ?? mime.lookup(localPath);

      const uploadParams = {
        Bucket:
          bucketName ?? this.configService.get('DIGITAL_OCEAN_FILE_BUCKET'),
        Key: key,
        Body: body,
        ACL: ObjectCannedACL.public_read_write,
        ContentType: contentType,
      };

      await S3Service.s3.send(new PutObjectCommand(uploadParams));

      return new S3UploadResponseDto(
        key,
        uploadParams.Bucket,
        `${this.endpoint}/${uploadParams.Bucket}/${key}`,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async uploadByBuffer(
    params: S3UploadBufferDto,
  ): Promise<S3UploadResponseDto> {
    try {
      const { key, bucketName, buffer, contentType } = params;

      const uploadParams = {
        Bucket:
          bucketName ?? this.configService.get('DIGITAL_OCEAN_FILE_BUCKET'),
        Key: key,
        Body: buffer,
        ACL: ObjectCannedACL.public_read_write,
        ContentType: contentType,
      };

      await S3Service.s3.send(new PutObjectCommand(uploadParams));

      return new S3UploadResponseDto(
        key,
        uploadParams.Bucket,
        `${this.endpoint}/${uploadParams.Bucket}/${key}`,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // TODO: add method to upload files from a stream
}
