import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENTS } from 'src/core/enums';

export const configCors = (
  app: INestApplication,
  configService: ConfigService,
) => {
  const env = configService.get<string>('NODE_ENV');

  const isDev = env !== ENVIRONMENTS.PRODUCTION && env !== ENVIRONMENTS.STAGING;

  const CORS_URL = configService.get<string>('FRONTEND_URL') || '*';

  app.enableCors({
    origin: isDev ? '*' : CORS_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, lang',
    credentials: CORS_URL !== '*',
  });
};
