import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';

import { I18nService, I18nValidationExceptionFilter } from 'nestjs-i18n';

import {
  ValidationExceptionFilter,
  AllExceptionsFilter,
} from 'src/core/filters';
import { CustomValidationPipe } from 'src/common/pipes';
import {
  LanguageInterceptor,
  TranslationInterceptor,
  HttpInterceptor,
} from 'src/core/interceptors';
import { configSwagger } from './swagger.config';
import { configCors } from './cors.config';
import { configS3 } from './s3.config';
import { configFirebase } from './firebase.config';
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

  // s3 config
  configS3(configService);

  // config firebase - uncomment if you need firebase
  configFirebase(configService);

  // initialize CommonMappingHelpers with ConfigService
  CommonMappingHelpers.initialize(configService);

  app.use(helmet());

  const i18nService = app.get(I18nService);

  app.useGlobalPipes(
    new CustomValidationPipe(
      i18nService as I18nService<Record<string, unknown>>,
    ),
  );

  // Global Exception Filter
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(i18nService, configService));
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Global Interceptors

  app.useGlobalInterceptors(new LanguageInterceptor());
  app.useGlobalInterceptors(new TranslationInterceptor(i18nService));
  app.useGlobalInterceptors(new HttpInterceptor());
}
