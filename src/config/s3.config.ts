import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/core/modules/s3/s3.service';

export const configS3 = (configService: ConfigService) => {
  const config = {
    region: configService.get('DIGITAL_OCEAN_REGION'),
    endpoint: configService.get('DIGITAL_OCEAN_ENDPOINT'),
    credentials: {
      accessKeyId: configService.get('DIGITAL_OCEAN_ACCESS_KEY'),
      secretAccessKey: configService.get('DIGITAL_OCEAN_SECRET_KEY'),
    },
    forcePathStyle: true,
  };
  S3Service.s3 = new S3Client(config);
};
