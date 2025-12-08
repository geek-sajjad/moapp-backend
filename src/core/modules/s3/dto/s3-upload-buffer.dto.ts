export class S3UploadBufferDto {
  key: string;

  buffer: Buffer;

  contentType: string;

  bucketName?: string;
}
