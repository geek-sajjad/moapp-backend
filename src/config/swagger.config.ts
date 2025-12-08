import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const configSwagger = (
  app: INestApplication,
  configService: ConfigService,
) => {
  const options = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE'))
    .setDescription(`Last updated: ${new Date().toLocaleString()}`)
    .setVersion(configService.get('SWAGGER_VERSION'))
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: configService.get('SWAGGER_TITLE'),
    swaggerOptions: {
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  };
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document, customOptions);
};
