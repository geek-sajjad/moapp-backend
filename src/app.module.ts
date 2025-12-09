import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { ScheduleModule } from '@nestjs/schedule';

import { LIST_OF_MODULES } from './modules/module-names';
import { configPostgres } from './config';
import { LIST_OF_CORE_MODULES } from './core/modules/core-module-names';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';

@Module({
  imports: [
    ...LIST_OF_MODULES,
    ...LIST_OF_CORE_MODULES,

    ConfigModule.forRoot({ isGlobal: true }),
    // EventEmitterModule.forRoot(),
    // ScheduleModule.forRoot(),

    // I18nModule.forRoot({
    //   fallbackLanguage: 'en', // Default language
    //   loaderOptions: {
    //     path: path.join(__dirname, '/i18n/'),
    //     watch: false,
    //   },
    //   resolvers: [
    //     new HeaderResolver(['lang', 'language']),
    //     AcceptLanguageResolver,
    //   ],
    // }),

    ThrottlerModule.forRoot([
      {
        ttl: 60 * 1000,
        limit: 100,
      },
    ]),

    // PostgreSQL integration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configPostgres(configService), // Use the PostgreSQL factory function
    }),

    // MongoDB integration (commented out - using PostgreSQL for accounting app)
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => configMongo(configService),
    // }),

    // AutoMapper integration for serlizing entities
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
