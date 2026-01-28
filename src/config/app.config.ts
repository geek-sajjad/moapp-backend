import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';

import {
  ValidationExceptionFilter,
  AllExceptionsFilter,
} from 'src/core/filters';
import { CustomValidationPipe } from 'src/common/pipes';
import {
  HttpInterceptor,
} from 'src/core/interceptors';
import { configSwagger } from './swagger.config';
import { configCors } from './cors.config';
import { CommonMappingHelpers } from '../core/mapping-profiles/common-mapping.helpers';
// import { configFirebase } from './firebase.config';

export async function ConfigApp(
  app: INestApplication,
  configService: ConfigService,
) {
  // Configure EJS template engine using NestJS API
  const expressApp = app as NestExpressApplication;
  expressApp.setBaseViewsDir(join(process.cwd(), 'public', 'html'));
  expressApp.setViewEngine('ejs');

  // Configure EJS options
  expressApp.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });
  // swagger configuration - only in development/staging to save memory
  const nodeEnv = configService.get('NODE_ENV');
  if (nodeEnv === 'development' || nodeEnv === 'staging') {
    configSwagger(app, configService);
  }

  // cors configuration
  configCors(app, configService);



  // initialize CommonMappingHelpers with ConfigService
  CommonMappingHelpers.initialize(configService);

  app.use(helmet());

  app.useGlobalPipes(new CustomValidationPipe());

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter(configService));
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Global Interceptors

  app.useGlobalInterceptors(new HttpInterceptor());
}
